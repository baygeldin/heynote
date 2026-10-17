// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "indigo",
    label: "Indigo",
    swatch: "#6a68cf",
    shared: {
        ui: {
            accent: "#6a68cf",
            focus: "#3a378b",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#6a68cf",
            accentSelectedHover: "#3d39a2",
            bufferTreeSelected: "#d4d3de",
            bodyBackground: "#ebebfa",
            blockOdd: "#ebebfa",
            statusBackground: "#6a68cf",
            highlight: "#6a68cf",
            mathBackground: "#6a68cf",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#1d1b65",
            accentSelectedHover: "#221f75",
            bufferTreeSelected: "#252442",
            bodyBackground: "#262537",
            editorBackground: "#1d1d2b",
            blockEven: "#262537",
            blockOdd: "#26254b",
            blockBorder: "#1d1d2b",
            statusBackground: "#100f1a",
            highlight: "#1d1b65",
            tabActive: "#26254b",
            tabActiveBlurred: "#1f1e38",
            mathBackground: "#100f1a",
            mathText: "#9a98cd",
        },
        syntax: {},
    },
}
