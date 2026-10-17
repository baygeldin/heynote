import { EditorView } from "@codemirror/view"

import { useHeynoteStore } from "../stores/heynote-store"
import { useSettingsStore } from "../stores/settings-store"


export function spellcheckConfig(enabled) {
    return [
        EditorView.contentAttributes.of({"spellcheck": enabled ? "true" : "false"})
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
