// @ts-check
// Custom OKLCH palette; see ../README.md for sources and color roles.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "pink",
    label: "Pink",
    shared: {
        ui: {},
        syntax: {},
    },
    light: {
        ui: {
            accent: "#9b527d",
            accentSelected: "#9b527d",
            accentSelectedHover: "#88476d",
            focus: "#9b527d",
            bufferTreeSelected: "#f0d5e3",
            bodyBackground: "#f7e9f0",
            editorBackground: "#faf1f6",
            blockEven: "#faf1f6",
            blockOdd: "#f7e9f0",
            blockBorder: "#e6d5de",
            statusBackground: "#9b527d",
            highlight: "#9b527d",
            tabActive: "#faf1f6",
            tabActiveBlurred: "#f7e9f0",
            mathBackground: "#9b527d",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accent: "#d28bb3",
            accentSelected: "#4b3341",
            accentSelectedHover: "#5b3d4e",
            focus: "#b7799c",
            bufferTreeSelected: "#4b3341",
            bodyBackground: "#2e2128",
            editorBackground: "#25191f",
            blockEven: "#2e2128",
            blockOdd: "#34252d",
            blockBorder: "#25191f",
            statusBackground: "#703b5a",
            highlight: "#4b3341",
            tabActive: "#34252d",
            tabActiveBlurred: "#2e2128",
            mathBackground: "#703b5a",
        },
        syntax: {},
    },
}
