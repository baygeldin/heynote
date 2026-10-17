// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "teal",
    label: "Teal",
    swatch: "#36aaa9",
    shared: {
        ui: {
            accent: "#36aaa9",
            focus: "#378b8b",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#36aaa9",
            accentSelectedHover: "#39a2a2",
            bufferTreeSelected: "#d3dede",
            bodyBackground: "#ebfafa",
            blockEven: "#f5fdfd",
            blockOdd: "#ebfafa",
            statusBackground: "#36aaa9",
            highlight: "#36aaa9",
            mathBackground: "#36aaa9",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#1b6565",
            accentSelectedHover: "#1f7575",
            bufferTreeSelected: "#244242",
            bodyBackground: "#253737",
            editorBackground: "#1d2b2b",
            blockEven: "#253737",
            blockOdd: "#254b4b",
            blockBorder: "#1d2b2b",
            statusBackground: "#0f1a1a",
            highlight: "#1b6565",
            tabActive: "#254b4b",
            tabActiveBlurred: "#1e3838",
            mathBackground: "#0f1a1a",
            mathText: "#98cdcd",
        },
        syntax: {},
    },
}
