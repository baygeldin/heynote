import { describe, expect, it, vi } from "vitest"
import { showAndFocusWindow } from "../../electron/main/window-visibility"
import { FOCUS_EDITOR_EVENT } from "../../src/common/constants"

function setup({ visible = false, minimized = false, isMac = true, isLinux = false } = {}) {
    let canMoveToActiveSpace = false
    let windowSpace = 'A'
    let activeSpace = 'B'
    const activationStates = []
    const win = {
        isVisible: () => visible,
        isMinimized: () => minimized,
        hide: vi.fn(() => { visible = false }),
        restore: vi.fn(() => {
            activationStates.push(canMoveToActiveSpace)
            minimized = false
        }),
        show: vi.fn(() => { visible = true }),
        showInactive: vi.fn(() => { visible = true }),
        focus: vi.fn(() => {
            if (canMoveToActiveSpace) windowSpace = activeSpace
            activationStates.push(canMoveToActiveSpace)
        }),
        setVisibleOnAllWorkspaces: vi.fn(),
        webContents: { send: vi.fn() },
    }
    const options = {
        isMac,
        isLinux,
        ensureVisible: vi.fn(),
        // Activating the application while its window is still on A is the bug.
        focusApp: vi.fn(() => {
            activeSpace = windowSpace
            activationStates.push(canMoveToActiveSpace)
        }),
        prepareToShowOnActiveSpace: vi.fn(() => { canMoveToActiveSpace = true }),
    }
    return {win, options, activationStates, activeSpace: () => activeSpace}
}

describe("showAndFocusWindow", () => {
    it.each([false, true])("moves the macOS window from A to B before activating the app (visible=%s)", (visible) => {
        const {win, options, activationStates, activeSpace} = setup({visible})

        showAndFocusWindow(win, options)

        expect(win.isVisible()).toBe(true)
        expect(activeSpace()).toBe('B')
        expect(options.prepareToShowOnActiveSpace).toHaveBeenCalledOnce()
        expect(activationStates).toEqual([true, true])
        expect(win.showInactive).toHaveBeenCalledOnce()
        expect(win.show).not.toHaveBeenCalled()
        expect(win.hide).not.toHaveBeenCalled()
        expect(win.setVisibleOnAllWorkspaces).not.toHaveBeenCalled()
        expect(win.focus).toHaveBeenCalledOnce()
        if (!visible) {
            expect(win.webContents.send).toHaveBeenCalledWith(FOCUS_EDITOR_EVENT)
        } else {
            expect(win.webContents.send).not.toHaveBeenCalled()
        }
    })

    it("prepares native relocation before restoring a minimized macOS window", () => {
        const {win, options, activationStates, activeSpace} = setup({minimized: true})

        showAndFocusWindow(win, options)

        expect(win.isMinimized()).toBe(false)
        expect(activationStates).toEqual([true, true, true])
        expect(activeSpace()).toBe('B')
    })

    it("does not activate the app if native relocation cannot be prepared", () => {
        const {win, options} = setup()
        options.prepareToShowOnActiveSpace.mockImplementation(() => { throw new Error("native relocation failed") })

        expect(() => showAndFocusWindow(win, options)).toThrow("native relocation failed")
        expect(win.focus).not.toHaveBeenCalled()
        expect(options.focusApp).not.toHaveBeenCalled()
    })

    it("raises a hidden Linux window without making it sticky across workspaces", () => {
        const {win, options} = setup({isMac: false, isLinux: true})

        showAndFocusWindow(win, options)

        expect(win.isVisible()).toBe(true)
        expect(win.hide).toHaveBeenCalledOnce()
        expect(win.hide.mock.invocationCallOrder[0]).toBeLessThan(win.show.mock.invocationCallOrder[0])
        expect(win.setVisibleOnAllWorkspaces).not.toHaveBeenCalled()
        expect(options.prepareToShowOnActiveSpace).not.toHaveBeenCalled()
        expect(win.webContents.send).toHaveBeenCalledWith(FOCUS_EDITOR_EVENT)
    })

    it("focuses an already visible non-macOS window without hiding it", () => {
        const {win, options} = setup({visible: true, isMac: false})

        showAndFocusWindow(win, options)

        expect(win.focus).toHaveBeenCalledOnce()
        expect(win.hide).not.toHaveBeenCalled()
        expect(win.show).not.toHaveBeenCalled()
        expect(win.showInactive).not.toHaveBeenCalled()
        expect(win.setVisibleOnAllWorkspaces).not.toHaveBeenCalled()
        expect(options.prepareToShowOnActiveSpace).not.toHaveBeenCalled()
        expect(win.webContents.send).not.toHaveBeenCalled()
    })
})
