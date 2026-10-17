<script>
    import { syntaxTree } from "@codemirror/language"
    import { toRaw } from 'vue';
    import { mapActions, mapState, mapWritableState, mapStores } from 'pinia'
    import { useHeynoteStore } from "../stores/heynote-store.js"
    import { useEditorCacheStore } from "../stores/editor-cache"
    import { REDO_EVENT, WINDOW_CLOSE_EVENT, DELETE_BLOCK_EVENT, UNDO_EVENT, SELECT_ALL_EVENT, EDITOR_CONTEXT_MENU_EVENT, REPLACE_MISSPELLING_EVENT } from '@/src/common/constants';
    import { getSpellingRange } from "../editor/spell-check.js"


    export default {
        props: {
            development: Boolean,
            debugSyntaxTree: Boolean,
        },

        components: {},

        data() {
            return {
                syntaxTreeDebugContent: null,
                editor: null,
                onWindowClose: null,
                onUndo: null,
                onRedo: null,
                onDeleteBlock: null,
                onSelectAll: null,
                onContextMenu: null,
                onReplaceMisspelling: null,
            }
        },

        mounted() {
            // initialize editorCacheStore (sets up watchers for settings changes, propagating them to all editors)
            this.editorCacheStore.setUp(this.$refs.editor);

            this.loadBuffer(this.currentBufferPath)

            // set up window close handler that will save the buffer and quit
            this.onWindowClose = () => {
                //console.log("content to save:", JSON.stringify(this.editorCacheStore.getContentToSave()))
                window.heynote.buffer.saveAndQuit(this.editorCacheStore.getAllBufferContent())
            }
            window.heynote.mainProcess.on(WINDOW_CLOSE_EVENT, this.onWindowClose)

            this.onUndo = () => {
                if (this.editor) {
                    toRaw(this.editor).undo()
                }
            }
            window.heynote.mainProcess.on(UNDO_EVENT, this.onUndo)

            this.onRedo = () => {
                if (this.editor) {
                    toRaw(this.editor).redo()
                }
            }
            window.heynote.mainProcess.on(REDO_EVENT, this.onRedo)
            
            this.onDeleteBlock = () => {
                if (this.editor) {
                    toRaw(this.editor).deleteActiveBlock()
                }
            }
            window.heynote.mainProcess.on(DELETE_BLOCK_EVENT, this.onDeleteBlock)

            this.onSelectAll = () => {
                const activeEl = document.activeElement
                if (activeEl && activeEl.tagName === "INPUT") {
                    // if the active element is an input, select all text in it
                    activeEl.select()
                } else if (this.editor) {
                    // make sure the editor is focused
                    if (this.$refs.editor.contains(activeEl)) {
                        toRaw(this.editor).selectAll()
                    }
                }
            }
            window.heynote.mainProcess.on(SELECT_ALL_EVENT, this.onSelectAll)

            // Use Electron's context-menu data so the native spellchecker can
            // identify the clicked word and provide replacement suggestions.
            let spellingContext = null
            this.onContextMenu = (_event, params) => {
                spellingContext = null
                const target = params.menuSourceType === "keyboard"
                    ? document.activeElement
                    : document.elementFromPoint(params.clientX, params.clientY)
                if (this.$refs.editor.contains(target) && target.closest(".cm-scroller")) {
                    const editor = toRaw(this.editor)
                    const range = getSpellingRange(editor.view, params)
                    if (editor.spellcheckEnabled && range) {
                        spellingContext = {editor, doc: editor.view.state.doc, ...range}
                    }
                    window.heynote.mainProcess.invoke("showEditorContextMenu", {
                        ...params,
                        spellcheckEnabled: spellingContext !== null,
                    })
                }
            }
            window.heynote.mainProcess.on(EDITOR_CONTEXT_MENU_EVENT, this.onContextMenu)

            // Keep the document, undo history, and autosave in sync by applying
            // corrections through CodeMirror rather than native DOM editing.
            this.onReplaceMisspelling = (_event, suggestion) => {
                if (!spellingContext) {
                    return
                }
                const {editor, doc, from, to} = spellingContext
                spellingContext = null
                // A menu opened for another buffer or an older document must
                // never replace text in the current editor.
                if (toRaw(this.editor) !== editor || editor.view.state.doc !== doc) {
                    return
                }
                editor.view.dispatch({
                    changes: {from, to, insert: suggestion},
                    selection: {anchor: from + suggestion.length},
                    userEvent: "input.replace",
                })
                editor.focus()
            }
            window.heynote.mainProcess.on(REPLACE_MISSPELLING_EVENT, this.onReplaceMisspelling)

            // if debugSyntaxTree prop is set, display syntax tree for debugging
            if (this.debugSyntaxTree) {
                setInterval(() => {
                    const cursorPos = this.editor.view.state.selection.main.head
                    function render(tree) {
                        let lists = ''
                        tree.iterate({
                            enter(type) {
                                let className = ""
                                if (type.from !== 0 && cursorPos > type.from && cursorPos <= type.to) {
                                    className = "active"
                                }
                                lists += `<ul><li class="${className}">${type.name} (${type.from},${type.to})`
                            },
                            leave() {
                                lists += '</ul>'
                            }
                        })
                        return lists
                    }
                    this.syntaxTreeDebugContent = render(syntaxTree(this.editor.view.state))
                }, 1000)
            }
        },

        beforeUnmount() {
            window.heynote.mainProcess.off(WINDOW_CLOSE_EVENT, this.onWindowClose)
            window.heynote.mainProcess.off(UNDO_EVENT, this.onUndo)
            window.heynote.mainProcess.off(REDO_EVENT, this.onRedo)
            window.heynote.mainProcess.off(DELETE_BLOCK_EVENT, this.onDeleteBlock)
            window.heynote.mainProcess.off(SELECT_ALL_EVENT, this.onSelectAll)
            window.heynote.mainProcess.off(EDITOR_CONTEXT_MENU_EVENT, this.onContextMenu)
            window.heynote.mainProcess.off(REPLACE_MISSPELLING_EVENT, this.onReplaceMisspelling)
            this.editorCacheStore.tearDown();
        },

        watch: {
            loadNewEditor() {
                //console.log("currentBufferPath changed to", path)
                this.loadBuffer(this.currentBufferPath)
            },
        },

        computed: {
            ...mapStores(useEditorCacheStore),
            ...mapState(useHeynoteStore, [
                "currentBufferPath",
                "libraryId",
            ]),
            ...mapWritableState(useHeynoteStore, [
                "currentEditor",
                "currentBufferName",
            ]),

            loadNewEditor() {
                return `${this.currentBufferPath}|${this.libraryId}`
            },
        },

        methods: {
            ...mapActions(useHeynoteStore, [
                "consumeFocusEditorOnBufferOpen",
            ]),

            loadBuffer(path) {
                //console.log("loadBuffer", path)
                if (this.editor) {
                    this.editor.hide()
                }

                const focusEditor = this.consumeFocusEditorOnBufferOpen()
                const [editor, created] = this.editorCacheStore.getOrCreateEditor(path, {
                    focus: focusEditor,
                })
                this.editor = editor
                if (!created) {
                    toRaw(editor).show()
                    if (focusEditor) {
                        toRaw(editor).focus()
                    }
                }

                this.currentEditor = toRaw(this.editor)
                window._heynote_editor = toRaw(this.editor)
            },

            setLanguage(language) {
                const editor = toRaw(this.editor)
                if (language === "auto") {
                    editor.setCurrentLanguage(null, true)
                } else {
                    editor.setCurrentLanguage(language, false)
                }
                editor.focus()
            },

            formatCurrentBlock() {
                const editor = toRaw(this.editor)
                editor.formatCurrentBlock()
                editor.focus()
            },

            focus() {
                toRaw(this.editor).focus()
            },
        },
    }
</script>

<template>
    <div>
        <div class="editor" ref="editor"></div>
        <div 
            v-if="debugSyntaxTree"
            v-html="syntaxTreeDebugContent"
            class="debug-syntax-tree"
        ></div>
    </div>
</template>

<style lang="sass">
    .debug-syntax-tree
        position: absolute
        top: 0
        bottom: 0
        right: 0
        width: 50%
        background-color: rgba(240, 240, 240, 0.85)
        color: #000
        font-size: 12px
        font-family: monospace
        padding: 10px
        overflow: auto

        li.active
            background-color: rgba(255, 255, 0, 0.5)

        ul
            padding-left: 20px
        > ul
            padding-left: 0
</style>
