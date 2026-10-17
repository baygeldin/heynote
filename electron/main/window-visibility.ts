import type { BrowserWindow } from 'electron'
import { FOCUS_EDITOR_EVENT } from '../../src/common/constants'

type ShowWindowOptions = {
    isMac: boolean
    isLinux: boolean
    ensureVisible: () => void
    focusApp: () => void
    prepareToShowOnActiveSpace: () => void
}

export function showAndFocusWindow(win: BrowserWindow, options: ShowWindowOptions) {
    const wasVisible = win.isVisible()

    // Electron's all-workspaces flag doesn't change where activation takes us.
    // Install AppKit's MoveToActiveSpace behavior before anything can activate
    // the app, including restoring a minimized window.
    if (options.isMac) {
        options.prepareToShowOnActiveSpace()
    }
    if (win.isMinimized()) {
        win.restore()
    }
    options.ensureVisible()
    if (options.isMac) {
        // Order the window onto the active Space without first activating the
        // application (show() activates the app before ordering its window).
        win.showInactive()
        win.focus()
        options.focusApp()
    } else {
        if (!wasVisible) {
            // Some Linux WMs need hide()+show() to raise the window.
            if (options.isLinux) win.hide()
            win.show()
        }
        options.focusApp()
        win.focus()
    }
    if (!wasVisible) {
        // Hidden windows can lose editor focus to the sidebar when shown.
        win.webContents.send(FOCUS_EDITOR_EVENT)
    }
}
