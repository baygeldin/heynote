import { Decoration, EditorView, ViewPlugin } from "@codemirror/view"
import { syntaxTree } from "@codemirror/language"

import { blockState, getNoteBlockFromPos } from "./block/block.js"
import { useSettingsStore } from "../stores/settings-store"

const proseLanguages = new Set(["text", "markdown"])
const markdownCodeNodes = new Set(["FencedCode", "CodeBlock", "InlineCode"])
const noSpellcheckLine = Decoration.line({attributes: {spellcheck: "false"}})
const noSpellcheckMark = Decoration.mark({attributes: {spellcheck: "false"}})

function spellcheckDecorations(view) {
    const {state} = view
    const decorations = []
    const disabledLines = new Set()
    const disableLines = (from, to) => {
        for (let pos = from; pos <= to;) {
            const line = state.doc.lineAt(pos)
            disabledLines.add(line.from)
            pos = line.to + 1
        }
    }

    for (const {from, to} of view.visibleRanges) {
        for (const block of state.field(blockState)) {
            if (block.content.to < from || block.content.from > to) {
                continue
            }
            const start = Math.max(from, block.content.from)
            const end = Math.min(to, block.content.to)
            if (!proseLanguages.has(block.language.name)) {
                disableLines(start, end)
            } else if (block.language.name === "markdown") {
                // Heynote mounts the Markdown parser as an overlay. Enter its
                // document explicitly so inline and fenced code are included.
                let node = syntaxTree(state).resolveInner(block.content.from, 1)
                while (node && !(node.name === "Document" && node.from === block.content.from)) {
                    node = node.parent
                }
                node?.cursor().iterate(node => {
                    if (node.to < start || node.from > end) {
                        return false
                    }
                    if (markdownCodeNodes.has(node.name)) {
                        const codeFrom = Math.max(start, node.from)
                        const codeTo = Math.min(end, node.to)
                        if (node.name === "InlineCode") {
                            if (codeFrom < codeTo) {
                                decorations.push(noSpellcheckMark.range(codeFrom, codeTo))
                            }
                        } else {
                            disableLines(codeFrom, codeTo)
                        }
                        return false
                    }
                })
            }
        }
    }
    for (const from of disabledLines) {
        decorations.push(noSpellcheckLine.range(from))
    }
    return Decoration.set(decorations, true)
}

const proseSpellcheck = ViewPlugin.fromClass(class {
    constructor(view) {
        this.decorations = spellcheckDecorations(view)
    }

    update(update) {
        if (update.docChanged || update.viewportChanged || syntaxTree(update.startState) !== syntaxTree(update.state)) {
            this.decorations = spellcheckDecorations(update.view)
        }
    }
}, {
    decorations: plugin => plugin.decorations,
})

export function spellcheckConfig(enabled) {
    return [
        EditorView.contentAttributes.of({"spellcheck": enabled ? "true" : "false"}),
        enabled ? proseSpellcheck : [],
    ]
}

export function getSpellingRange(view, {misspelledWord, clientX, clientY, menuSourceType}) {
    if (!misspelledWord) {
        return null
    }
    const pos = menuSourceType === "keyboard"
        ? view.state.selection.main.head
        : view.posAtCoords({x: clientX, y: clientY})
    if (pos === null) {
        return null
    }
    const block = getNoteBlockFromPos(view.state, pos)
    if (!block || !proseLanguages.has(block.language.name)) {
        return null
    }
    if (block.language.name === "markdown") {
        for (let node = syntaxTree(view.state).resolveInner(pos, -1); node; node = node.parent) {
            if (markdownCodeNodes.has(node.name)) {
                return null
            }
        }
    }
    const line = view.state.doc.lineAt(pos)
    const offset = pos - line.from
    const start = line.text.lastIndexOf(misspelledWord, offset)
    if (start < 0 || start + misspelledWord.length < offset) {
        return null
    }
    return {from: line.from + start, to: line.from + start + misspelledWord.length}
}

export function toggleSpellcheck(editor) {
    return (view) => {
        const settingsStore = useSettingsStore()
        settingsStore.setSpellcheckEnabled(!settingsStore.spellcheckEnabled)
    }
}

export function enableSpellcheck(editor) {
    return (view) => {
        const settingsStore = useSettingsStore()
        settingsStore.setSpellcheckEnabled(true)
    }
}

export function disableSpellcheck(editor) {
    return (view) => {
        const settingsStore = useSettingsStore()
        settingsStore.setSpellcheckEnabled(false)
    }
}
