// @ts-check
// Custom OKLCH palette; see ../README.md for sources and color roles.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "orange",
    label: "Orange",
    shared: {
        ui: {},
        syntax: {},
    },
    light: {
        ui: {
            accent: "#976213",
            accentSelected: "#976213",
            accentSelectedHover: "#84550f",
            focus: "#976213",
            bufferTreeSelected: "#eedbc6",
            bodyBackground: "#f6ece1",
            editorBackground: "#f9f3eb",
            blockEven: "#f9f3eb",
            blockOdd: "#f6ece1",
            blockBorder: "#e5d9cc",
            statusBackground: "#976213",
            highlight: "#976213",
            tabActive: "#f9f3eb",
            tabActiveBlurred: "#f6ece1",
            mathBackground: "#976213",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accent: "#cd995c",
            accentSelected: "#493824",
            accentSelectedHover: "#594329",
            focus: "#b2854f",
            bufferTreeSelected: "#493824",
            bodyBackground: "#2d2318",
            editorBackground: "#241b12",
            blockEven: "#2d2318",
            blockOdd: "#33281c",
            blockBorder: "#241b12",
            statusBackground: "#6d4610",
            highlight: "#493824",
            tabActive: "#33281c",
            tabActiveBlurred: "#2d2318",
            mathBackground: "#6d4610",
        },
        syntax: {},
    },
}
