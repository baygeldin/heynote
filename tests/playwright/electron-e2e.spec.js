import { test as base, expect, _electron as electron } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { FileLibrary } from '../../electron/main/file-library'

import { HeynotePage } from "./test-utils.js"
import { NoteFormat } from "../../src/common/note-format.js"
import { parseImagesFromString } from "../../src/editor/image/image-parsing.js"

const test = base.extend({
    initialConfig: [null, {option: true}],
})

async function ensureElectronBuild() {
    const mainPath = path.join(process.cwd(), 'dist-electron', 'main', 'index.js')
    const preloadPath = path.join(process.cwd(), 'dist-electron', 'preload', 'index.js')
    try {
        await fs.stat(mainPath)
        await fs.stat(preloadPath)
        return
    } catch {
        // build below
    }

    await new Promise((resolve, reject) => {
        const child = spawn('npx', ['vite', 'build'], {
            stdio: 'inherit',
            env: {
                ...process.env,
            },
        })
        child.on('error', reject)
        child.on('exit', (code) => {
            if (code === 0) {
                resolve()
                return
            }
            reject(new Error(`vite build failed with exit code ${code}`))
        })
    })
}

async function dirExists(path) {
    try {
        const stat = await fs.stat(path);
        return stat.isDirectory();
    } catch (err) {
        if (err.code === "ENOENT") return false;
        throw err; // other errors (permissions etc.)
    }
}

async function removeDirWithRetry(dirPath, retries = 5) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            await fs.rm(dirPath, { recursive: true, force: true })
            return
        } catch (err) {
            if (err.code !== "ENOTEMPTY" || attempt === retries) {
                throw err
            }
            await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)))
        }
    }
}


test.describe('electron app', { tag: "@e2e" }, () => {
    test.describe.configure({ mode: 'serial' });
    test.skip(({ browserName }) => browserName !== 'chromium', 'Electron runs only once under chromium')

    /**@type{HeynotePage}*/
    let heynotePage
    let electronApp
    let tmpRoot
    let userDataDir
    let page

    test.beforeEach(async ({ initialConfig }) => {
        test.setTimeout(60000)
        await ensureElectronBuild()
        tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'heynote-e2e-'))
        userDataDir = path.join(tmpRoot, 'user-data')
        await fs.mkdir(userDataDir)

        if (initialConfig) {
            await fs.writeFile(path.join(userDataDir, 'config.json'), JSON.stringify(initialConfig))
        }

        electronApp = await electron.launch({
            args: ['--no-sandbox', 'tests/playwright/electron-runner.cjs'],
            env: {
                ...process.env,
                HEYNOTE_TEST_USER_DATA_DIR: userDataDir,
            },
        })

        page = await electronApp.firstWindow()
        await page.waitForLoadState('domcontentloaded')
        // Also wait for hidden windows to initialize their editor and quit handler.
        await expect(page.locator('.cm-editor')).toBeAttached()


        heynotePage = new HeynotePage(page)
        //await heynotePage.goto()
    })
    test.afterEach(async ({ page }) => {
        if (electronApp) {
            await electronApp.close()
        }
        if (await dirExists(tmpRoot)) {
            await removeDirWithRetry(tmpRoot)
        }
    })

    test('uses temp user data and notes library', async () => {
        await expect(page).toHaveTitle(/Heynote/i)

        const userData = await electronApp.evaluate(({ app }) => app.getPath('userData'))
        const notesDir = path.join(userData, 'notes')
        const scratchPath = path.join(notesDir, 'scratch.txt')
        const configPath = path.join(userData, 'config.json')

        await expect.poll(async () => {
            return await fs.stat(scratchPath).then(() => true).catch(() => false)
        }).toBe(true)

        await expect.poll(async () => {
            return await fs.stat(configPath).then(() => true).catch(() => false)
        }).toBe(true)

        const config = JSON.parse(await fs.readFile(configPath, 'utf8'))
        expect(config.clientId).toBe('testing')

        expect(userData).toBe(userDataDir)
        expect(configPath.startsWith(userDataDir)).toBe(true)
        expect(notesDir.startsWith(userDataDir)).toBe(true)
    })

    test('buffer is saved to disk', async () => {
        //heynotePage.goto()
        //await page.waitForTimeout(3000)
        await expect.poll(async () => (await heynotePage.getBlocks()).length).toBeGreaterThan(0)
        //console.log("blocks:", await heynotePage.getBlocks())
        await page.locator(".cm-content").first().click()
        await page.locator("body").press(heynotePage.agnosticKey("Mod+A"))
        await page.locator("body").press(heynotePage.agnosticKey("Mod+A"))
        await page.locator("body").pressSequentially("Hello World!")
        await expect.poll(async () => await heynotePage.getBlockContent(0)).toBe("Hello World!")
        await heynotePage.waitForContentSaved()

        const library = new FileLibrary(path.join(userDataDir, 'notes'))
        const bufferContent = await library.load("scratch.txt")
        expect(bufferContent.endsWith("Hello World!")).toBeTruthy()
    })

    test('scratchpad colors persist in txt metadata across app restarts', async () => {
        await heynotePage.setContent('{"formatVersion":"2.0.0","name":"Scratch","custom":[42]}\n∞∞∞text\nKeep this content')
        await page.locator('.tab-item.active .buffer-color').click()
        await page.getByRole('menuitemradio', {name: 'Violet', exact: true}).click()
        await expect(page.getByRole('menu')).toHaveCount(0)

        const scratchPath = path.join(userDataDir, 'notes', 'scratch.txt')
        await expect.poll(async () => {
            return NoteFormat.load(await fs.readFile(scratchPath, 'utf8')).metadata.color
        }).toBe('violet')
        const saved = NoteFormat.load(await fs.readFile(scratchPath, 'utf8'))
        expect(saved.metadata).toMatchObject({name: 'Scratch', custom: [42]})
        expect(saved.content).toBe('\n∞∞∞text\nKeep this content')

        await page.locator('.add-tab').click()
        await page.locator('.note-selector .new-note').click()
        await page.locator('.new-buffer input[placeholder="Name"]').fill('Work')
        await page.locator('.new-buffer button[type="submit"]').click()
        await expect(page.locator('.tab-item.active .title')).toHaveText('Work')
        await page.locator('.tab-item.active .buffer-color').click()
        await page.getByRole('menuitemradio', {name: 'Blue', exact: true}).click()
        await expect(page.getByRole('menu')).toHaveCount(0)

        await electronApp.close()
        electronApp = await electron.launch({
            args: ['--no-sandbox', 'tests/playwright/electron-runner.cjs'],
            env: {...process.env, HEYNOTE_TEST_USER_DATA_DIR: userDataDir},
        })
        page = await electronApp.firstWindow()
        await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'blue')
        await expect(page.locator('.tab-item.active .buffer-color')).toHaveAttribute('aria-label', 'Change color for Work (Blue)')

        // Scratch has no cached editor yet. Its dot comes from the on-disk metadata.
        const scratchTab = page.locator('.tab-item').filter({hasText: 'Scratch'})
        await expect(scratchTab.locator('.buffer-color')).toHaveAttribute('aria-label', 'Change color for Scratch (Violet)')
        await scratchTab.locator('.buffer-color').click()
        await page.getByRole('menuitemradio', {name: 'Indigo', exact: true}).click()
        await expect(page.getByRole('menu')).toHaveCount(0)
        await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'blue')
        await expect(page.locator('.status .note')).toHaveText('Work')
        expect(NoteFormat.load(await fs.readFile(scratchPath, 'utf8')).metadata.color).toBe('indigo')

        await scratchTab.locator('.title').click()
        await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'indigo')
        expect(await page.evaluate(() => window._heynote_editor.getContent())).toContain('Keep this content')
    })

    async function windowState() {
        return electronApp.evaluate(({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0]
            return {
                alwaysOnTop: win.isAlwaysOnTop(),
                allWorkspaces: win.isVisibleOnAllWorkspaces(),
                fullscreen: win.isFullScreen(),
                fullscreenable: win.isFullScreenable(),
                visible: win.isVisible(),
            }
        })
    }

    test('always floats on a single workspace and has no pin controls', async () => {
        expect(await windowState()).toMatchObject({
            alwaysOnTop: true,
            allWorkspaces: false,
            fullscreen: false,
            fullscreenable: false,
        })
        await expect(page.locator('.status-block.pin')).toHaveCount(0)
        await page.locator('.status-block.settings').click()
        await expect(page.getByLabel('Always on top', {exact: true})).toHaveCount(0)

        // Even a stale settings update must not turn floating off.
        await page.evaluate(() => window.heynote.mainProcess.invoke('settings:set', {...window.heynote.settings, alwaysOnTop: false}))
        await expect.poll(async () => {
            const config = JSON.parse(await fs.readFile(path.join(userDataDir, 'config.json'), 'utf8'))
            return config.settings.alwaysOnTop
        }).toBe(true)
        expect((await windowState()).alwaysOnTop).toBe(true)
    })

    test.describe('upgrading existing settings', () => {
        test.use({initialConfig: {
            settings: {
                alwaysOnTop: false,
                startHidden: true,
                keyBindings: [
                    {key: 'Mod-Shift-p', command: 'toggleAlwaysOnTop'},
                    {key: 'Mod-Shift-f', command: 'openLibrarySearch'},
                ],
            },
            windowConfig: {isFullScreen: true},
        }})

        test('migrates old pin preferences and ignores fullscreen restoration when started hidden', async () => {
            expect(await windowState()).toMatchObject({alwaysOnTop: true, visible: false, fullscreen: false})
            const config = JSON.parse(await fs.readFile(path.join(userDataDir, 'config.json'), 'utf8'))
            expect(config.settings.alwaysOnTop).toBe(true)
            expect(config.settings.keyBindings).toEqual([{key: 'Mod-Shift-f', command: 'openLibrarySearch'}])

            // A second-instance activation uses the same summon path as the hotkey.
            await electronApp.evaluate(({ app }) => app.emit('second-instance'))
            await expect.poll(windowState).toMatchObject({
                alwaysOnTop: true,
                allWorkspaces: false,
                fullscreen: false,
                fullscreenable: false,
                visible: true,
            })
        })
    })

    test('customizable global hotkey still hides and shows the floating window', async () => {
        // Capture the callback while still using Electron's real registration.
        // Invoking it avoids depending on an X11 key injection utility.
        await electronApp.evaluate(({ globalShortcut }) => {
            const register = globalShortcut.register.bind(globalShortcut)
            globalShortcut.register = (accelerator, callback) => {
                globalThis.__testHotkey = callback
                return register(accelerator, callback)
            }
        })
        await page.locator('.status-block.settings').click()
        await page.getByLabel('Enable Global Hotkey').check()
        await page.locator('.keyboard-hotkey select').selectOption('J')
        await expect.poll(async () => electronApp.evaluate(({ globalShortcut }) => {
            return globalShortcut.isRegistered('CmdOrCtrl+Shift+J')
        })).toBe(true)
        await page.locator('.settings .bottom-bar .close').click()

        await electronApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].focus())
        await expect.poll(async () => electronApp.evaluate(({ BrowserWindow }) => {
            return BrowserWindow.getAllWindows()[0].isFocused()
        })).toBe(true)
        await electronApp.evaluate(() => globalThis.__testHotkey())
        await expect.poll(windowState).toMatchObject({visible: false, alwaysOnTop: true})
        await electronApp.evaluate(() => globalThis.__testHotkey())
        await expect.poll(windowState).toMatchObject({visible: true, alwaysOnTop: true, allWorkspaces: false})
        await expect.poll(async () => page.evaluate(() => {
            return document.activeElement?.classList.contains('cm-content')
        })).toBe(true)
    })

    test.describe('macOS native Space behavior', () => {
        test.skip(process.platform !== 'darwin', 'Requires AppKit')

        test('uses MoveToActiveSpace during activation and removes it on the next run loop', async () => {
            const prepared = await electronApp.evaluate(({ BrowserWindow }) => {
                const bridge = require(require('node:path').join(process.cwd(), 'dist-electron/native/macos-window.node'))
                const win = BrowserWindow.getAllWindows()[0]
                const handle = win.getNativeWindowHandle()
                bridge.prepareToShow(handle)
                // Multiple summons in the same turn must not save a temporary
                // MoveToActiveSpace flag as the permanent window behavior.
                bridge.prepareToShow(handle)
                win.showInactive()
                win.focus()
                return bridge.getState(handle)
            })
            expect(prepared).toMatchObject({movesToActiveSpace: true, onAllSpaces: false})
            await expect.poll(async () => electronApp.evaluate(({ BrowserWindow }) => {
                const bridge = require(require('node:path').join(process.cwd(), 'dist-electron/native/macos-window.node'))
                return bridge.getState(BrowserWindow.getAllWindows()[0].getNativeWindowHandle())
            })).toMatchObject({movesToActiveSpace: false, onAllSpaces: false, onActiveSpace: true})
        })
    })

    test('pastes image data, stores it, and copy button writes image to clipboard', async () => {
        await expect.poll(async () => (await heynotePage.getBlocks()).length).toBeGreaterThan(0)

        await page.evaluate(async () => {
            const canvas = document.createElement("canvas")
            canvas.width = 300
            canvas.height = 300
            const ctx = canvas.getContext("2d")
            ctx.fillStyle = "#1e90ff"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/png")
            )
            const item = new ClipboardItem({ [blob.type]: blob })

            window.__testClipboardItems = [item]
            window.__clipboardWriteItems = []

            navigator.clipboard.read = async () => window.__testClipboardItems
            navigator.clipboard.write = async (items) => {
                window.__clipboardWriteItems = items
            }
        })

        await page.locator("body").press(heynotePage.agnosticKey("Mod+V"))

        await expect.poll(async () => {
            const content = await heynotePage.getContent()
            return parseImagesFromString(content)
        }).not.toHaveLength(0)

        await expect(page.locator(".heynote-image")).toHaveCount(1)

        const content = await heynotePage.getContent()
        const images = parseImagesFromString(content)
        expect(images).toHaveLength(1)
        expect(images[0].file.startsWith("heynote-file://image/")).toBe(true)

        const encodedName = images[0].file.replace("heynote-file://image/", "")
        const filename = decodeURIComponent(encodedName)
        const storedPath = path.join(userDataDir, "notes", ".images", filename)

        await expect.poll(async () => {
            return await fs.stat(storedPath).then((stat) => stat.size > 0).catch(() => false)
        }).toBe(true)
        //await page.waitForTimeout(100000)
        await page.evaluate(() => {
            const button = document.querySelector(".heynote-image .buttons-container button")
            if (!button) {
                throw new Error("Copy button not found")
            }
            button.click()
        })

        await expect.poll(async () => {
            const types = await page.evaluate(() => {
                return (window.__clipboardWriteItems || []).flatMap((item) => item.types)
            })
            return types.some((type) => type.startsWith("image/"))
        }).toBe(true)
    })
})
