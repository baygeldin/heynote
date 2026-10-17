// @ts-check
// Custom OKLCH palette; see ../README.md for sources and color roles.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "green",
    label: "Green",
    shared: {
        ui: {},
        syntax: {},
    },
    light: {
        ui: {
            accent: "#317f67",
            accentSelected: "#317f67",
            accentSelectedHover: "#2c6e5a",
            focus: "#317f67",
            bufferTreeSelected: "#c8e6da",
            bodyBackground: "#e3f2ec",
            editorBackground: "#ecf7f2",
            blockEven: "#ecf7f2",
            blockOdd: "#e3f2ec",
            blockBorder: "#cde0d8",
            statusBackground: "#317f67",
            highlight: "#317f67",
            tabActive: "#ecf7f2",
            tabActiveBlurred: "#e3f2ec",
            mathBackground: "#317f67",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accent: "#5cb99b",
            accentSelected: "#254339",
            accentSelectedHover: "#2a5143",
            focus: "#50a187",
            bufferTreeSelected: "#254339",
            bodyBackground: "#192923",
            editorBackground: "#12201b",
            blockEven: "#192923",
            blockOdd: "#1d2e28",
            blockBorder: "#12201b",
            statusBackground: "#245b4a",
            highlight: "#254339",
            tabActive: "#1d2e28",
            tabActiveBlurred: "#192923",
            mathBackground: "#245b4a",
        },
        syntax: {},
    },
}
