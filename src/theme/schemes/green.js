// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "green",
    label: "Green",
    swatch: "#48b57e",
    shared: {
        ui: {
            accent: "#48b57e",
            focus: "#378b65",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#48b57e",
            accentSelectedHover: "#39a273",
            bufferTreeSelected: "#d3ded9",
            bodyBackground: "#ebfaf3",
            blockEven: "#f5fdf9",
            blockOdd: "#ebfaf3",
            statusBackground: "#48b57e",
            highlight: "#48b57e",
            mathBackground: "#48b57e",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#1b6543",
            accentSelectedHover: "#1f754e",
            bufferTreeSelected: "#244234",
            bodyBackground: "#25372f",
            editorBackground: "#1d2b24",
            blockEven: "#25372f",
            blockOdd: "#254b3a",
            blockBorder: "#1d2b24",
            statusBackground: "#0f1a15",
            highlight: "#1b6543",
            tabActive: "#254b3a",
            tabActiveBlurred: "#1e382d",
            mathBackground: "#0f1a15",
            mathText: "#98cdb5",
        },
        syntax: {},
    },
}
