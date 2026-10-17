import type { BrowserWindow } from 'electron'
import { FOCUS_EDITOR_EVENT } from '../../src/common/constants'

type ShowWindowOptions = {
    isMac: boolean
    isLinux: boolean
    ensureVisible: () => void
    focusApp: () => void
}

export function showAndFocusWindow(win: BrowserWindow, options: ShowWindowOptions) {
    const wasVisible = win.isVisible()

    // A macOS window can be visible on a different Space. Temporarily join all
    // Spaces before restoring/showing/focusing it so activation brings the
    // window here instead of switching back to its previous Space.
    if (options.isMac) {
        win.hide()
        win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true, skipTransformProcessType: true})
    }
    try {
        if (win.isMinimized()) {
            win.restore()
        }
        options.ensureVisible()
        if (!wasVisible || options.isMac) {
            // Some Linux WMs need hide()+show() to raise the window.
            if (options.isLinux) {
                win.hide()
            }
            win.show()
        }
        options.focusApp()
        win.focus()
    } finally {
        if (options.isMac) {
            // Keep fullscreen auxiliary support, but pin the window to this
            // Space again before returning to the event loop.
            win.setVisibleOnAllWorkspaces(false, {visibleOnFullScreen: true, skipTransformProcessType: true})
        }
    }
    if (!wasVisible) {
        // Hidden windows can lose editor focus to the sidebar when shown.
        win.webContents.send(FOCUS_EDITOR_EVENT)
    }
}
