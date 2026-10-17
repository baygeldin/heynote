// @ts-check
// Custom OKLCH palette; see ../README.md for sources and color roles.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "blue",
    label: "Blue",
    shared: {
        ui: {},
        syntax: {},
    },
    light: {
        ui: {
            accent: "#2d74aa",
            accentSelected: "#2d74aa",
            accentSelectedHover: "#266595",
            focus: "#2d74aa",
            bufferTreeSelected: "#cce1f4",
            bodyBackground: "#e4eff9",
            editorBackground: "#edf5fc",
            blockEven: "#edf5fc",
            blockOdd: "#e4eff9",
            blockBorder: "#cfdde9",
            statusBackground: "#2d74aa",
            highlight: "#2d74aa",
            tabActive: "#edf5fc",
            tabActiveBlurred: "#e4eff9",
            mathBackground: "#2d74aa",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accent: "#6dabdf",
            accentSelected: "#2a3e50",
            accentSelectedHover: "#304b61",
            focus: "#5e95c3",
            bufferTreeSelected: "#2a3e50",
            bodyBackground: "#1b2730",
            editorBackground: "#141e27",
            blockEven: "#1b2730",
            blockOdd: "#1f2c36",
            blockBorder: "#141e27",
            statusBackground: "#21547b",
            highlight: "#2a3e50",
            tabActive: "#1f2c36",
            tabActiveBlurred: "#1b2730",
            mathBackground: "#21547b",
        },
        syntax: {},
    },
}
