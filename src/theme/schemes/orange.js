// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "orange",
    label: "Orange",
    swatch: "#ce7c29",
    shared: {
        ui: {
            accent: "#ce7c29",
            focus: "#8b6137",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#ce7c29",
            accentSelectedHover: "#a26e39",
            bufferTreeSelected: "#ded9d3",
            bodyBackground: "#faf2eb",
            blockEven: "#fdf9f5",
            blockOdd: "#faf2eb",
            statusBackground: "#ce7c29",
            highlight: "#ce7c29",
            mathBackground: "#ce7c29",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#65401b",
            accentSelectedHover: "#754a1f",
            bufferTreeSelected: "#423324",
            bodyBackground: "#372e25",
            editorBackground: "#2b241d",
            blockEven: "#372e25",
            blockOdd: "#4b3825",
            blockBorder: "#2b241d",
            statusBackground: "#1a140f",
            highlight: "#65401b",
            tabActive: "#4b3825",
            tabActiveBlurred: "#382b1e",
            mathBackground: "#1a140f",
            mathText: "#cdb398",
        },
        syntax: {},
    },
}
