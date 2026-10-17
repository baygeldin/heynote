import { test, expect } from '@playwright/test'
import { HeynotePage } from './test-utils.js'
import { NoteFormat } from '@/src/common/note-format.js'

const colors = ['Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']

async function createBuffer(page, name) {
    await page.locator('.add-tab').click()
    await page.locator('.note-selector .new-note').click()
    await page.locator('.new-buffer input[placeholder="Name"]').fill(name)
    await page.locator('.new-buffer button[type="submit"]').click()
    await expect(page.locator('.tab-item.active .title')).toHaveText(name)
}

async function chooseColor(page, tab, color) {
    await tab.locator('.buffer-color').click()
    await page.getByRole('menuitemradio', { name: color, exact: true }).click()
    await expect(page.getByRole('menu')).toHaveCount(0)
}

async function uiColors(page) {
    return page.evaluate(() => {
        const editor = document.querySelector('.cm-editor:not([style*="display: none"])')
        return {
            status: getComputedStyle(document.querySelector('.status')).backgroundColor,
            block: getComputedStyle(editor.querySelector('.block-odd') || editor.querySelector('.block-even')).backgroundColor,
        }
    })
}

for (const theme of ['light', 'dark']) {
    test(`all eight scratchpad colors update the ${theme} UI and survive reload`, async ({ page }) => {
        const heynote = new HeynotePage(page)
        await heynote.goto()
        await page.evaluate(theme => window.heynote.themeMode.set(theme), theme)
        await expect(page.locator('html')).toHaveAttribute('theme', theme)
        await heynote.setContent('{"formatVersion":"2.0.0","name":"Scratch","custom":[42]}\n∞∞∞text\nFirst\n∞∞∞text\nSecond')
        const tab = page.locator('.tab-item.active')
        const original = await uiColors(page)
        const statuses = new Set()
        const blocks = new Set()

        for (const color of colors) {
            await chooseColor(page, tab, color)
            await expect(page.locator('html')).toHaveAttribute('data-buffer-color', color.toLowerCase())
            const ui = await uiColors(page)
            statuses.add(ui.status)
            blocks.add(ui.block)
            if (color === 'Grey') expect(ui).toEqual(original)
            const note = NoteFormat.load(await heynote.getStoredBuffer('scratch.txt'))
            expect(note.metadata).toMatchObject({ color: color.toLowerCase(), name: 'Scratch', custom: [42] })
            expect(note.content).toBe('\n∞∞∞text\nFirst\n∞∞∞text\nSecond')
        }
        expect(statuses.size).toBe(colors.length)
        expect(blocks.size).toBe(colors.length)

        await page.reload()
        await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'violet')
        await expect(tab.locator('.buffer-color')).toHaveAttribute('aria-label', 'Change color for Scratch (Violet)')
        expect(await heynote.getBlockContent(1)).toBe('Second')
        expect(heynote.getErrors()).toEqual([])
    })
}

test('opening a picker activates its note and replaces the previous picker without losing edits', async ({ page }) => {
    const heynote = new HeynotePage(page)
    await heynote.goto()
    await heynote.setContent('{"formatVersion":"2.0.0","name":"Scratch"}\n∞∞∞text\nKeep me')
    await chooseColor(page, page.locator('.tab-item.active'), 'Red')
    await createBuffer(page, 'Work')
    await page.locator('.cm-content').last().pressSequentially('Work in progress')
    const workPath = await page.evaluate(() => window._heynote_editor.path)
    await chooseColor(page, page.locator('.tab-item.active'), 'Blue')
    const blueUI = await uiColors(page)
    const work = page.locator('.tab-item').filter({ has: page.locator('.title', { hasText: /^Work$/ }) })

    const scratch = page.locator('.tab-item').filter({ has: page.locator('.title', { hasText: /^Scratch$/ }) })
    await work.locator('.buffer-color').click()
    await expect(page.getByRole('menu', { name: 'Color for Work', exact: true })).toBeVisible()
    await scratch.locator('.buffer-color').click()
    await expect(page.locator('.tab-item.active .title')).toHaveText('Scratch')
    await expect(page.locator('.status .note')).toHaveText('Scratch')
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'red')
    await expect(page.getByRole('menu')).toHaveCount(1)
    await expect(page.getByRole('menu', { name: 'Color for Scratch', exact: true })).toBeVisible()
    await expect(work.locator('.buffer-color')).toHaveAttribute('aria-expanded', 'false')
    await page.getByRole('menuitemradio', { name: 'Orange', exact: true }).click()
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'orange')
    await work.locator('.title').click()
    expect(await uiColors(page)).toEqual(blueUI)
    expect(await heynote.getBlockContent(0)).toBe('Work in progress')

    // Keyboard activation must also replace the picker and load an uncached note.
    await page.reload()
    await expect(page.locator('.tab-item.active .title')).toHaveText('Work')
    await work.locator('.buffer-color').click()
    await expect(page.getByRole('menu', { name: 'Color for Work', exact: true })).toBeVisible()
    await scratch.locator('.buffer-color').focus()
    await scratch.locator('.buffer-color').press('Enter')
    await expect(page.getByRole('menu')).toHaveCount(1)
    await expect(page.getByRole('menu', { name: 'Color for Scratch', exact: true })).toBeVisible()
    await expect(page.locator('.status .note')).toHaveText('Scratch')
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'orange')
    await expect(work.locator('.buffer-color')).toHaveAttribute('aria-expanded', 'false')
    await page.getByRole('menuitemradio', { name: 'Indigo', exact: true }).click()
    await expect(page.getByRole('menu')).toHaveCount(0)
    expect(NoteFormat.load(await heynote.getStoredBuffer('scratch.txt')).content).toBe('\n∞∞∞text\nKeep me')
    expect(NoteFormat.load(await heynote.getStoredBuffer(workPath)).metadata.color).toBe('blue')

    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'indigo')
    expect(await heynote.getBlockContent(0)).toBe('Keep me')
    await scratch.hover()
    await scratch.locator('.close').click()
    await page.locator('body').press(heynote.agnosticKey('Mod+Shift+t'))
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'indigo')
    expect(heynote.getErrors()).toEqual([])
})

test('missing and unknown colors use grey, including external metadata changes', async ({ page }) => {
    const heynote = new HeynotePage(page)
    await heynote.goto()
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'grey')
    await chooseColor(page, page.locator('.tab-item.active'), 'Red')
    for (const color of [undefined, 'unknown', '__proto__']) {
        const note = new NoteFormat()
        note.metadata.color = color
        note.content = '\n∞∞∞text\nLegacy note'
        await heynote.setContent(note.serialize())
        await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'grey')
        await expect(page.locator('.buffer-color')).toHaveAttribute('aria-label', /\(Grey\)$/)
    }
    expect(heynote.getErrors()).toEqual([])
})

test('color picker supports keyboard selection, Escape, and outside dismissal', async ({ page }) => {
    const heynote = new HeynotePage(page)
    await heynote.goto()
    const trigger = page.locator('.tab-item.active .buffer-color')
    await trigger.focus()
    await trigger.press('Enter')
    await expect(page.getByRole('menuitemradio', { name: 'Grey', exact: true })).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('menuitemradio', { name: 'Red', exact: true })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'red')
    await expect(trigger).toBeFocused()
    await trigger.press('Space')
    await expect(page.getByRole('menu')).toBeVisible()
    await expect(page.getByRole('menuitemradio', { name: 'Red', exact: true })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await trigger.click()
    await expect(page.getByRole('menu')).toBeVisible()
    await page.locator('.cm-content').click()
    await expect(page.getByRole('menu')).toHaveCount(0)
    expect(heynote.getErrors()).toEqual([])
})

test('color picker is available beside the title when tabs are hidden', async ({ page }) => {
    const heynote = new HeynotePage(page)
    await heynote.goto()
    await heynote.setSettings({ ...(await heynote.getSettings()), showTabs: false })
    const title = page.locator('.tab-bar > .title')
    await chooseColor(page, title, 'Yellow')
    await expect(page.locator('html')).toHaveAttribute('data-buffer-color', 'yellow')
    expect(NoteFormat.load(await heynote.getStoredBuffer('scratch.txt')).metadata.color).toBe('yellow')
    expect(heynote.getErrors()).toEqual([])
})
