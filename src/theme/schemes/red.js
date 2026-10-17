// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "red",
    label: "Red",
    swatch: "#d65b5b",
    shared: {
        ui: {
            accent: "#d65b5b",
            focus: "#8b3737",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#d65b5b",
            accentSelectedHover: "#a23939",
            bufferTreeSelected: "#ded3d3",
            bodyBackground: "#faebeb",
            blockEven: "#fdf5f5",
            blockOdd: "#faebeb",
            statusBackground: "#d65b5b",
            highlight: "#d65b5b",
            mathBackground: "#d65b5b",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#651b1b",
            accentSelectedHover: "#751f1f",
            bufferTreeSelected: "#422424",
            bodyBackground: "#372525",
            editorBackground: "#2b1d1d",
            blockEven: "#372525",
            blockOdd: "#4b2525",
            blockBorder: "#2b1d1d",
            statusBackground: "#1a0f0f",
            highlight: "#651b1b",
            tabActive: "#4b2525",
            tabActiveBlurred: "#381e1e",
            mathBackground: "#1a0f0f",
            mathText: "#cd9898",
        },
        syntax: {},
    },
}
