// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "pink",
    label: "Pink",
    swatch: "#d563a0",
    shared: {
        ui: {
            accent: "#d563a0",
            focus: "#8b3761",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#d563a0",
            accentSelectedHover: "#a2396e",
            bufferTreeSelected: "#ded3d9",
            bodyBackground: "#faebf2",
            blockEven: "#fdf5f9",
            blockOdd: "#faebf2",
            statusBackground: "#d563a0",
            highlight: "#d563a0",
            mathBackground: "#d563a0",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#651b40",
            accentSelectedHover: "#751f4a",
            bufferTreeSelected: "#422433",
            bodyBackground: "#37252e",
            editorBackground: "#2b1d24",
            blockEven: "#37252e",
            blockOdd: "#4b2538",
            blockBorder: "#2b1d24",
            statusBackground: "#1a0f14",
            highlight: "#651b40",
            tabActive: "#4b2538",
            tabActiveBlurred: "#381e2b",
            mathBackground: "#1a0f14",
            mathText: "#cd98b3",
        },
        syntax: {},
    },
}
