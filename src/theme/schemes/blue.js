// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "blue",
    label: "Blue",
    swatch: "#428bd1",
    shared: {
        ui: {
            accent: "#428bd1",
            focus: "#37618b",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#428bd1",
            accentSelectedHover: "#396ea2",
            bufferTreeSelected: "#d3d9de",
            bodyBackground: "#ebf2fa",
            blockOdd: "#ebf2fa",
            statusBackground: "#428bd1",
            highlight: "#428bd1",
            mathBackground: "#428bd1",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#1b4065",
            accentSelectedHover: "#1f4a75",
            bufferTreeSelected: "#243342",
            bodyBackground: "#252e37",
            editorBackground: "#1d242b",
            blockEven: "#252e37",
            blockOdd: "#25384b",
            blockBorder: "#1d242b",
            statusBackground: "#0f141a",
            highlight: "#1b4065",
            tabActive: "#25384b",
            tabActiveBlurred: "#1e2b38",
            mathBackground: "#0f141a",
            mathText: "#98b3cd",
        },
        syntax: {},
    },
}
