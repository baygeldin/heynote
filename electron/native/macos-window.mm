#import <Cocoa/Cocoa.h>
#import <objc/runtime.h>
#import <dispatch/dispatch.h>
#include <node_api.h>
#include <cstring>

#define NAPI_CHECK(call) \
    if ((call) != napi_ok) { \
        napi_throw_error(env, nullptr, "macOS window bridge: " #call " failed"); \
        return nullptr; \
    }

static char originalBehaviorKey;

static NSWindow* GetWindow(napi_env env, napi_callback_info info) {
    if (![NSThread isMainThread]) {
        napi_throw_error(env, nullptr, "macOS window operations require the main thread");
        return nullptr;
    }
    size_t argc = 1;
    napi_value args[1];
    NAPI_CHECK(napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    bool isBuffer = false;
    if (argc == 1) {
        NAPI_CHECK(napi_is_buffer(env, args[0], &isBuffer));
    }
    if (!isBuffer) {
        napi_throw_type_error(env, nullptr, "Expected an Electron native window handle Buffer");
        return nullptr;
    }
    void* data;
    size_t length;
    NAPI_CHECK(napi_get_buffer_info(env, args[0], &data, &length));
    if (length != sizeof(void*)) {
        napi_throw_type_error(env, nullptr, "Invalid native window handle size");
        return nullptr;
    }
    void* pointer = nullptr;
    std::memcpy(&pointer, data, sizeof(pointer));
    // Electron's macOS handle contains an NSView*, not an NSWindow*.
    NSWindow* window = [(__bridge NSView*)pointer window];
    if (!window) {
        napi_throw_error(env, nullptr, "The native view has no window");
    }
    return window;
}

static napi_value PrepareToShow(napi_env env, napi_callback_info info) {
    NSWindow* window = GetWindow(env, info);
    if (!window) return nullptr;

    // https://developer.apple.com/documentation/appkit/nswindow/collectionbehavior-swift.struct/movetoactivespace
    // Joining all Spaces does not change activation's destination. Ask AppKit
    // to move this window before Electron activates the application instead.
    if (!objc_getAssociatedObject(window, &originalBehaviorKey)) {
        const auto originalBehavior = window.collectionBehavior &
            ~(NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorMoveToActiveSpace);
        objc_setAssociatedObject(window, &originalBehaviorKey, @(originalBehavior), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        // Activation is processed by AppKit's run loop. A synchronous reset is
        // too early; leaving MoveToActiveSpace set can disturb later Space switches.
        // Keep one saved value even if a second summon arrives before this runs.
        dispatch_async(dispatch_get_main_queue(), ^{
            NSNumber* original = objc_getAssociatedObject(window, &originalBehaviorKey);
            window.collectionBehavior = original.unsignedIntegerValue;
            objc_setAssociatedObject(window, &originalBehaviorKey, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
        });
    }
    window.collectionBehavior = (window.collectionBehavior & ~NSWindowCollectionBehaviorCanJoinAllSpaces) |
        NSWindowCollectionBehaviorMoveToActiveSpace;
    // The hotkey hides the entire app on macOS. Make its windows eligible for
    // focus again without activating the app on the old Space first.
    [NSApp unhideWithoutActivation];

    napi_value result;
    NAPI_CHECK(napi_get_undefined(env, &result));
    return result;
}

static napi_value GetState(napi_env env, napi_callback_info info) {
    NSWindow* window = GetWindow(env, info);
    if (!window) return nullptr;
    napi_value result;
    NAPI_CHECK(napi_create_object(env, &result));
    const char* names[] = {"onActiveSpace", "movesToActiveSpace", "onAllSpaces"};
    const bool values[] = {
        [window isOnActiveSpace] != NO,
        (window.collectionBehavior & NSWindowCollectionBehaviorMoveToActiveSpace) != 0,
        (window.collectionBehavior & NSWindowCollectionBehaviorCanJoinAllSpaces) != 0,
    };
    for (size_t i = 0; i < 3; i++) {
        napi_value value;
        NAPI_CHECK(napi_get_boolean(env, values[i], &value));
        NAPI_CHECK(napi_set_named_property(env, result, names[i], value));
    }
    return result;
}

static napi_value Init(napi_env env, napi_value exports) {
    const napi_property_descriptor properties[] = {
        {"prepareToShow", nullptr, PrepareToShow, nullptr, nullptr, nullptr, napi_default_method, nullptr},
        {"getState", nullptr, GetState, nullptr, nullptr, nullptr, napi_default_method, nullptr},
    };
    NAPI_CHECK(napi_define_properties(env, exports, 2, properties));
    return exports;
}

NAPI_MODULE(macos_window, Init)
