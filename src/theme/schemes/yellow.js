// @ts-check
// Missing roles inherit from defaults.js; shared applies in both modes.
/** @satisfies {import("../types").ColorScheme} */
export default {
    id: "yellow",
    label: "Yellow",
    swatch: "#dfb52e",
    shared: {
        ui: {
            accent: "#af8b19",
            focus: "#8b7a37",
        },
        syntax: {},
    },
    light: {
        ui: {
            accentSelected: "#af8b19",
            accentSelectedHover: "#a28d39",
            bufferTreeSelected: "#dedcd3",
            bodyBackground: "#faf7eb",
            blockEven: "#fdfbf5",
            blockOdd: "#faf7eb",
            statusBackground: "#af8b19",
            highlight: "#af8b19",
            mathBackground: "#af8b19",
        },
        syntax: {},
    },
    dark: {
        ui: {
            accentSelected: "#65561b",
            accentSelectedHover: "#75641f",
            bufferTreeSelected: "#423c24",
            bodyBackground: "#373325",
            editorBackground: "#2b281d",
            blockEven: "#373325",
            blockOdd: "#4b4425",
            blockBorder: "#2b281d",
            statusBackground: "#1a170f",
            highlight: "#65561b",
            tabActive: "#4b4425",
            tabActiveBlurred: "#38331e",
            mathBackground: "#1a170f",
            mathText: "#cdc298",
        },
        syntax: {},
    },
}
