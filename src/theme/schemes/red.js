// @ts-check
// Custom OKLCH palette; see ../README.md for sources and color roles.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "red",
    label: "Red",
    shared: {
        ui: {},
        syntax: {},
    },
    light: {
        ui: {
            accent: "#a55347",
            accentSelected: "#a55347",
            accentSelectedHover: "#90483d",
            focus: "#a55347",
            bufferTreeSelected: "#f5d6d0",
            bodyBackground: "#faeae7",
            editorBackground: "#fcf1ef",
            blockEven: "#fcf1ef",
            blockOdd: "#faeae7",
            blockBorder: "#e9d6d2",
            statusBackground: "#a55347",
            highlight: "#a55347",
            tabActive: "#fcf1ef",
            tabActiveBlurred: "#faeae7",
            mathBackground: "#a55347",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accent: "#dc8c7f",
            accentSelected: "#4f342f",
            accentSelectedHover: "#603d38",
            focus: "#c07a6e",
            bufferTreeSelected: "#4f342f",
            bodyBackground: "#30211e",
            editorBackground: "#261917",
            blockEven: "#30211e",
            blockOdd: "#362522",
            blockBorder: "#261917",
            statusBackground: "#783c33",
            highlight: "#4f342f",
            tabActive: "#362522",
            tabActiveBlurred: "#30211e",
            mathBackground: "#783c33",
        },
        syntax: {},
    },
}
