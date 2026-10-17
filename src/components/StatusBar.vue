<script>
    import { mapState, mapStores } from 'pinia'
    import UpdateStatusItem from './UpdateStatusItem.vue'
    import { LANGUAGES } from '../editor/languages.js'
    import { formatDate, formatFullDate } from '../common/format-date'
    import { useHeynoteStore } from "../stores/heynote-store"
    import { useSettingsStore } from "../stores/settings-store"
    
    const LANGUAGE_MAP = Object.fromEntries(LANGUAGES.map(l => [l.token, l]))
    const LANGUAGE_NAMES = Object.fromEntries(LANGUAGES.map(l => [l.token, l.name]))


    export default {
        props: [
            "autoUpdate",
            "allowBetaVersions",
        ],

        components: {
            UpdateStatusItem,
        },

        mounted() {
            
        },

        computed: {
            ...mapStores(useHeynoteStore, useSettingsStore),
            ...mapState(useHeynoteStore, [
                "currentBufferName",
                "currentCursorLine",
                "currentLanguage", 
                "currentSelectionSize", 
                "currentLanguage",
                "currentLanguageAuto",
                "currentCreatedTime",
                "systemLocale",
            ]),
            ...mapState(useSettingsStore, [
                "spellcheckEnabled",
                "settings",
                "commandKeyBindingsMap",
                "theme",
            ]),

            isDarkTheme() {
                return this.theme === "dark" || (this.theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)
            },

            themeToggleTitle() {
                return this.isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
            },

            languageName() {
                return LANGUAGE_NAMES[this.currentLanguage] || this.currentLanguage
            },

            className() {
                return `status`
            },

            supportsFormat() {
                const lang = LANGUAGE_MAP[this.currentLanguage]
                return !!lang ? lang.supportsFormat : false
            },

            cmdKey() {
                return window.heynote.platform.isMac ? "⌘" : "Ctrl"
            },

            formatBlockTitle() {
                return `Format Block Content (Alt + Shift + F)`
            },

            updatesEnabled() {
                return !!window.heynote.autoUpdate
            },


            formattedCreatedTime() {
                if (!this.currentCreatedTime) {
                    return null
                }
                return formatDate(this.currentCreatedTime, this.systemLocale)
            },

            createdTimeTitle() {
                if (!this.currentCreatedTime) {
                    return null
                }
                return "Block created " +  formatFullDate(this.currentCreatedTime, this.systemLocale)
            },
        },

        methods: {
            toggleTheme() {
                this.settingsStore.setTheme(this.isDarkTheme ? "light" : "dark")
            },

            onSpellcheckingContextMenu(event) {
                event.preventDefault()
                window.heynote.mainProcess.invoke('showSpellcheckingContextMenu')
            },

            getTooltip(text, command) {
                const bindings = this.commandKeyBindingsMap[command]
                return bindings.length === 0 ? text : `${text} (${bindings[0]})`
            }
        },
    }
</script>

<template>
    <div :class="className">
        <div 
            @click.stop="$emit('toggleLeftPanel')"
            class="status-block sidebar clickable"
            :title="getTooltip('Toggle Sidebar', 'toggleLeftPanel')"
        >
            <span class="icon icon-format"></span>
        </div>
        <div class="status-block line-number">
            Ln <span class="num">{{ currentCursorLine?.line }}</span>
            Col <span class="num">{{ currentCursorLine?.col }}</span>
            <template v-if="currentSelectionSize > 0">
                Sel <span class="num">{{ currentSelectionSize }}</span>
            </template>
        </div>
        <div 
            :title="createdTimeTitle"
            class="status-block created-time"
        >
            {{ formattedCreatedTime }}
        </div>
        <div class="spacer"></div>
        <div 
            @click.stop="$emit('openBufferSelector')"
            class="status-block note clickable"
            :title="getTooltip('Change Buffer', 'openBufferSelector')"
        >
            {{ currentBufferName }} 
        </div>
        <div 
            @click.stop="$emit('openLanguageSelector')"
            class="status-block lang clickable"
            :title="getTooltip('Change language for current block', 'openLanguageSelector')"
        >
            {{ languageName }} 
            <span v-if="currentLanguageAuto" class="auto">(auto)</span>
        </div>
        <div 
            v-if="supportsFormat"
            @click.stop="$emit('formatCurrentBlock')"
            class="status-block format clickable"
            :title="getTooltip('Format Block Content', 'formatBlockContent')"
        >
            <span class="icon icon-format"></span>
        </div>
        <div 
            @click.stop="$emit('toggleSpellcheck')"
            @mousedown.prevent
            @contextmenu="onSpellcheckingContextMenu"
            :class="'status-block spellcheck clickable' + (this.spellcheckEnabled ? ' spellcheck-enabled' : '')"
            :title="getTooltip('Spellchecking', 'toggleSpellcheck')"
        >
            <span class="icon icon-format"></span>
        </div>

        <button
            type="button"
            class="status-block theme-toggle clickable"
            :title="themeToggleTitle"
            :aria-label="themeToggleTitle"
            @click.stop="toggleTheme"
            @mousedown.prevent
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <template v-if="isDarkTheme">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </template>
                <path v-else d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" />
            </svg>
        </button>
        <UpdateStatusItem 
            v-if="updatesEnabled" 
            :autoUpdate="autoUpdate"
            :allowBetaVersions="allowBetaVersions"
        />
        <div 
            @click.stop="$emit('openSettings')"
            class="status-block settings clickable"
            title="Settings"
        >
            <span class="icon icon-format"></span>
        </div>
    </div>
</template>

<style scoped lang="sass">
    .status
        box-sizing: border-box
        height: 22px
        width: 100%
        background: var(--status-bar-background)
        color: var(--status-bar-color)
        font-family: "Open Sans"
        font-size: 12px
        padding-left: 0px
        padding-right: 0px
        display: flex
        flex-direction: row
        align-items: center
        user-select: none
        white-space: nowrap
        overflow: hidden

        .spacer
            flex-grow: 1
        
        .status-block
            box-sizing: border-box
            height: 22px
            padding: 4px 10px
            cursor: default
            &:first-child
                padding-left: 12px
            &:last-child
                padding-right: 12px
            &.clickable
                cursor: pointer
                &:hover
                    background-color: rgba(255,255,255, 0.1)
            .icon
                display: block
                width: 14px
                height: 22px
                +dark-mode
                    opacity: 0.9
        .line-number
            color: rgba(255, 255, 255, 0.7)
            .num
                color: rgba(255, 255, 255, 1.0)
            +dark-mode
                color: rgba(255, 255, 255, 0.55)
                .num
                    color: rgba(255, 255, 255, 0.75)
        .lang .auto
            color: rgba(255, 255, 255, 0.7)
            +dark-mode
                color: rgba(255, 255, 255, 0.55)
        
        .sidebar
            padding-top: 0
            padding-bottom: 0
            .icon
                background-size: 15px
                background-repeat: no-repeat
                background-position: center center
                background-image: url("@/assets/icons/sidebar.svg")
        
        .format
            padding-top: 0
            padding-bottom: 0
            .icon
                background-size: 16px
                background-repeat: no-repeat
                background-position: center center
                background-image: url("@/assets/icons/format.svg")

        .spellcheck
            padding-top: 0
            padding-bottom: 0
            opacity: 1.0
            .icon
                background-size: 13px
                background-repeat: no-repeat
                background-position: center center
                background-image: url("@/assets/icons/spellcheck-off.svg")
            &.spellcheck-enabled .icon
                background-image: url("@/assets/icons/spellcheck.svg")
        
        .theme-toggle
            display: flex
            align-items: center
            justify-content: center
            flex-shrink: 0
            padding-top: 0
            padding-bottom: 0
            background: none
            border: none
            color: inherit
            &:focus-visible
                outline: 1px solid currentColor
                outline-offset: -3px
            svg
                display: block
                width: 14px
                height: 14px

        .settings
            padding-top: 0
            padding-bottom: 0
            .icon
                background-size: 13px
                background-repeat: no-repeat
                background-position: center center
                background-image: url("@/assets/icons/settings.svg")

</style>
