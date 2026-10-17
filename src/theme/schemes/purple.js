// @ts-check
// Custom OKLCH palette; see ../README.md for sources and color roles.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "purple",
    label: "Purple",
    shared: {
        ui: {},
        syntax: {},
    },
    light: {
        ui: {
            accent: "#7460a7",
            accentSelected: "#7460a7",
            accentSelectedHover: "#655493",
            focus: "#7460a7",
            bufferTreeSelected: "#dfdaf3",
            bodyBackground: "#eeecf9",
            editorBackground: "#f4f2fb",
            blockEven: "#f4f2fb",
            blockOdd: "#eeecf9",
            blockBorder: "#dbd8e8",
            statusBackground: "#7460a7",
            highlight: "#7460a7",
            tabActive: "#f4f2fb",
            tabActiveBlurred: "#eeecf9",
            mathBackground: "#7460a7",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accent: "#a998dd",
            accentSelected: "#3d384f",
            accentSelectedHover: "#494260",
            focus: "#9384c1",
            bufferTreeSelected: "#3d384f",
            bodyBackground: "#262330",
            editorBackground: "#1d1b26",
            blockEven: "#262330",
            blockOdd: "#2b2836",
            blockBorder: "#1d1b26",
            statusBackground: "#534579",
            highlight: "#3d384f",
            tabActive: "#2b2836",
            tabActiveBlurred: "#262330",
            mathBackground: "#534579",
        },
        syntax: {},
    },
}
