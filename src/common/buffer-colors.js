export const BUFFER_COLORS = [
    { id: "grey", label: "Grey", swatch: "#8c8c8c", hue: 0 },
    { id: "red", label: "Red", swatch: "#d65b5b", hue: 0 },
    { id: "orange", label: "Orange", swatch: "#ce7c29", hue: 30 },
    { id: "yellow", label: "Yellow", swatch: "#dfb52e", hue: 48 },
    { id: "green", label: "Green", swatch: "#48b57e", hue: 153 },
    { id: "blue", label: "Blue", swatch: "#428bd1", hue: 210 },
    { id: "indigo", label: "Indigo", swatch: "#6a68cf", hue: 242 },
    { id: "violet", label: "Violet", swatch: "#aa62c8", hue: 282 },
]

export function normalizeBufferColor(color) {
    return BUFFER_COLORS.some(option => option.id === color) ? color : "grey"
}

// CSS variables let cached editors and the rest of the UI change together,
// without rebuilding CodeMirror's syntax highlighting or editor state.
export function getBufferColorStyles(color) {
    const option = BUFFER_COLORS.find(option => option.id === normalizeBufferColor(color))
    const shade = (saturation, lightness) => `hsl(${option.hue} ${option.id === "grey" ? 0 : saturation}% ${lightness}%)`
    const styles = {
        "--accent-color": option.id === "yellow" ? "#af8b19" : option.swatch,
        "--accent-hover-color": shade(48, 43),
        "--accent-dark-color": shade(58, 25),
        "--accent-dark-hover-color": shade(58, 29),
        "--accent-focus-color": shade(43, 38),
        "--buffer-tree-selected-light": shade(14, 85),
        "--buffer-tree-selected-dark": shade(29, 20),
        "--block-light-background": shade(60, 95),
        "--editor-dark-background": shade(20, 14),
        "--block-dark-even-background": shade(19, 18),
        "--block-dark-odd-background": shade(34, 22),
        "--tab-dark-blurred-background": shade(30, 17),
        "--status-dark-background": shade(25, 8),
        "--math-dark-color": shade(34, 70),
    }

    // Preserve the original green accents; backgrounds use the selected hue.
    //if (option.id === "green") {
    //    Object.assign(styles, {
    //        "--accent-hover-color": "#3ea471",
    //        "--accent-dark-color": "#1b6540",
    //        "--accent-dark-hover-color": "#1f7449",
    //        "--accent-focus-color": "#388c62",
    //        "--buffer-tree-selected-light": "#d4ded9",
    //        "--buffer-tree-selected-dark": "#244233",
    //        "--math-dark-color": "#96cbb4",
    //    })
    //}
    return styles
}
