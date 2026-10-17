// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "violet",
    label: "Violet",
    swatch: "#aa62c8",
    shared: {
        ui: {
            accent: "#aa62c8",
            focus: "#72378b",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#aa62c8",
            accentSelectedHover: "#8339a2",
            bufferTreeSelected: "#dbd3de",
            bodyBackground: "#f5ebfa",
            blockOdd: "#f5ebfa",
            statusBackground: "#aa62c8",
            highlight: "#aa62c8",
            mathBackground: "#aa62c8",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#4f1b65",
            accentSelectedHover: "#5b1f75",
            bufferTreeSelected: "#392442",
            bodyBackground: "#312537",
            editorBackground: "#271d2b",
            blockEven: "#312537",
            blockOdd: "#40254b",
            blockBorder: "#271d2b",
            statusBackground: "#160f1a",
            highlight: "#4f1b65",
            tabActive: "#40254b",
            tabActiveBlurred: "#311e38",
            mathBackground: "#160f1a",
            mathText: "#bd98cd",
        },
        syntax: {},
    },
}
