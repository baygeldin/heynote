import type { BrowserWindow } from 'electron'
import { join } from 'node:path'

type MacWindowState = {
    onActiveSpace: boolean
    movesToActiveSpace: boolean
    onAllSpaces: boolean
}
type MacWindowBridge = {
    prepareToShow(handle: Buffer): void
    getState(handle: Buffer): MacWindowState
}

let bridge: MacWindowBridge
function getBridge(): MacWindowBridge {
    if (!bridge) {
        // This absolute, dynamic require is kept out of the JS bundle. The
        // .node file is built by Vite and unpacked by electron-builder.
        bridge = require(join(__dirname, '../native/macos-window.node'))
    }
    return bridge
}

export function prepareToShowOnActiveSpace(win: BrowserWindow) {
    getBridge().prepareToShow(win.getNativeWindowHandle())
}

export function isOnActiveSpace(win: BrowserWindow): boolean {
    return getBridge().getState(win.getNativeWindowHandle()).onActiveSpace
}
