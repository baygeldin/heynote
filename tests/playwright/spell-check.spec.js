import { test, expect } from "@playwright/test"
import { HeynotePage } from "./test-utils.js"

let heynotePage

test.beforeEach(async ({page}) => {
    await page.addInitScript(() => {
        localStorage.setItem("settings", JSON.stringify({spellcheckEnabled: true}))
    })
    heynotePage = new HeynotePage(page)
    await heynotePage.goto()
})

async function spellcheckAt(page, text) {
    return page.evaluate(text => {
        const view = window._heynote_editor.view
        const pos = view.state.doc.toString().indexOf(text)
        if (pos < 0) throw new Error(`Missing text: ${text}`)
        const {node} = view.domAtPos(pos + Math.floor(text.length / 2))
        const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node
        return element.closest("[spellcheck]").getAttribute("spellcheck")
    }, text)
}

test("checks prose but excludes programming languages and math in the same note", async ({page}) => {
    await heynotePage.setContent('\n∞∞∞text\nspelingprose\n∞∞∞javascript\nconst spelingjs = "spelingstring"; // spelingcomment\n∞∞∞python\nspelingpython = 1\n∞∞∞json\n{"spelingjson": true}\n∞∞∞math\nspelingmath = 1\n∞∞∞markdown\n# spelingmarkdown')
    for (const text of ["spelingprose", "spelingmarkdown"]) {
        await expect.poll(() => spellcheckAt(page, text)).toBe("true")
    }
    for (const text of ["spelingjs", "spelingstring", "spelingcomment", "spelingpython", "spelingjson", "spelingmath"]) {
        await expect.poll(() => spellcheckAt(page, text)).toBe("false")
    }
})

test("updates spelling scope when a block changes language or spellchecking is toggled", async ({page}) => {
    await heynotePage.setContent('\n∞∞∞text\nspeling')
    await expect.poll(() => spellcheckAt(page, "speling")).toBe("true")
    await page.evaluate(() => window._heynote_editor.setCurrentLanguage("javascript", false))
    await expect.poll(() => spellcheckAt(page, "speling")).toBe("false")
    await page.evaluate(() => window._heynote_editor.setCurrentLanguage("text", false))
    await expect.poll(() => spellcheckAt(page, "speling")).toBe("true")

    await heynotePage.executeCommand("disableSpellcheck")
    await expect.poll(() => spellcheckAt(page, "speling")).toBe("false")
    await heynotePage.executeCommand("enableSpellcheck")
    await expect.poll(() => spellcheckAt(page, "speling")).toBe("true")
    expect(heynotePage.getErrors()).toEqual([])
})

test("excludes Markdown code while preserving prose and updates after editing fences", async ({page}) => {
    const content = '\n∞∞∞markdown\nspelingbefore `spelinginline` spelingafter\n\n```javascript\nconst spelingfenced = 1;\n```\n\n    spelingindented\n\nspelinglast'
    await heynotePage.setContent(content)
    for (const text of ["spelingbefore", "spelingafter", "spelinglast"]) {
        await expect.poll(() => spellcheckAt(page, text)).toBe("true")
    }
    for (const text of ["spelinginline", "spelingfenced", "spelingindented"]) {
        await expect.poll(() => spellcheckAt(page, text)).toBe("false")
    }

    await page.evaluate(() => {
        const view = window._heynote_editor.view
        const from = view.state.doc.toString().indexOf("```javascript")
        view.dispatch({changes: {from, to: from + "```javascript".length, insert: ""}})
    })
    await expect.poll(() => spellcheckAt(page, "spelingfenced")).toBe("true")
    expect(heynotePage.getErrors()).toEqual([])
})

test("keeps code excluded when scrolling to lines outside the initial viewport", async ({page}) => {
    const content = '\n∞∞∞text\nspelingprose\n∞∞∞javascript\n' + "// spelingcode\n".repeat(500) + "const spelinglast = 1"
    await heynotePage.setContent(content)
    await page.evaluate(() => {
        const view = window._heynote_editor.view
        view.dispatch({selection: {anchor: view.state.doc.length}, scrollIntoView: true})
    })
    await expect.poll(() => spellcheckAt(page, "spelinglast")).toBe("false")
    expect(heynotePage.getErrors()).toEqual([])
})
