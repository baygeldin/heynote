import { describe, expect, it, vi } from "vitest"
import { showAndFocusWindow } from "../../electron/main/window-visibility"
import { FOCUS_EDITOR_EVENT } from "../../src/common/constants"

function setup({ visible = false, minimized = false, isMac = true, isLinux = false } = {}) {
    let allWorkspaces = false
    const activationStates = []
    const win = {
        isVisible: () => visible,
        isMinimized: () => minimized,
        hide: vi.fn(() => { visible = false }),
        restore: vi.fn(() => {
            activationStates.push(allWorkspaces)
            minimized = false
        }),
        show: vi.fn(() => {
            activationStates.push(allWorkspaces)
            visible = true
        }),
        focus: vi.fn(() => { activationStates.push(allWorkspaces) }),
        setVisibleOnAllWorkspaces: vi.fn((value) => { allWorkspaces = value }),
        webContents: { send: vi.fn() },
    }
    const options = {
        isMac,
        isLinux,
        ensureVisible: vi.fn(),
        focusApp: vi.fn(() => { activationStates.push(allWorkspaces) }),
    }
    return {win, options, activationStates, isAllWorkspaces: () => allWorkspaces}
}

describe("showAndFocusWindow", () => {
    it.each([false, true])("summons a macOS window even if visible on another Space (visible=%s)", (visible) => {
        const {win, options, activationStates, isAllWorkspaces} = setup({visible})

        showAndFocusWindow(win, options)

        expect(win.isVisible()).toBe(true)
        expect(win.show).toHaveBeenCalledOnce()
        expect(win.focus).toHaveBeenCalledOnce()
        // Every activation must happen while the window can join this Space.
        expect(activationStates).toEqual([true, true, true])
        expect(isAllWorkspaces()).toBe(false)
        expect(win.setVisibleOnAllWorkspaces).toHaveBeenLastCalledWith(false, {
            visibleOnFullScreen: true,
            skipTransformProcessType: true,
        })
        if (!visible) {
            expect(win.webContents.send).toHaveBeenCalledWith(FOCUS_EDITOR_EVENT)
        } else {
            expect(win.webContents.send).not.toHaveBeenCalled()
        }
    })

    it("also joins the active Space before restoring a minimized macOS window", () => {
        const {win, options, activationStates, isAllWorkspaces} = setup({minimized: true})

        showAndFocusWindow(win, options)

        expect(win.isMinimized()).toBe(false)
        expect(activationStates).toEqual([true, true, true, true])
        expect(isAllWorkspaces()).toBe(false)
    })

    it("never leaves a macOS window on every Space if showing fails", () => {
        const {win, options, isAllWorkspaces} = setup()
        win.show.mockImplementation(() => { throw new Error("show failed") })

        expect(() => showAndFocusWindow(win, options)).toThrow("show failed")
        expect(isAllWorkspaces()).toBe(false)
    })

    it("raises a hidden Linux window without making it sticky across workspaces", () => {
        const {win, options} = setup({isMac: false, isLinux: true})

        showAndFocusWindow(win, options)

        expect(win.isVisible()).toBe(true)
        expect(win.hide).toHaveBeenCalledOnce()
        expect(win.hide.mock.invocationCallOrder[0]).toBeLessThan(win.show.mock.invocationCallOrder[0])
        expect(win.setVisibleOnAllWorkspaces).not.toHaveBeenCalled()
        expect(win.webContents.send).toHaveBeenCalledWith(FOCUS_EDITOR_EVENT)
    })

    it("focuses an already visible non-macOS window without hiding it", () => {
        const {win, options} = setup({visible: true, isMac: false})

        showAndFocusWindow(win, options)

        expect(win.focus).toHaveBeenCalledOnce()
        expect(win.hide).not.toHaveBeenCalled()
        expect(win.show).not.toHaveBeenCalled()
        expect(win.setVisibleOnAllWorkspaces).not.toHaveBeenCalled()
        expect(win.webContents.send).not.toHaveBeenCalled()
    })
})
