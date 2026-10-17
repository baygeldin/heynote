// Edit the literal hex colors in each scheme to customize its appearance.
// swatch controls the tab dot and picker; styles controls the active note UI.
// Light mode alternates white blocks with --block-light-background.
// Dark mode uses --block-dark-even-background and --block-dark-odd-background.
export const BUFFER_COLORS = [
    {
        id: "grey",
        label: "Grey",
        swatch: "#8c8c8c",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#8c8c8c",
            "--accent-hover-color": "#6e6e6e",
            "--accent-focus-color": "#616161",
            "--buffer-tree-selected-light": "#d9d9d9",
            "--block-light-background": "#f2f2f2",

            // Dark mode.
            "--accent-dark-color": "#404040",
            "--accent-dark-hover-color": "#4a4a4a",
            "--buffer-tree-selected-dark": "#333333",
            "--editor-dark-background": "#242424",
            "--block-dark-even-background": "#2e2e2e",
            "--block-dark-odd-background": "#383838",
            "--tab-dark-blurred-background": "#2b2b2b",
            "--status-dark-background": "#141414",
            "--math-dark-color": "#b3b3b3",
        },
    },
    {
        id: "red",
        label: "Red",
        swatch: "#d65b5b",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#d65b5b",
            "--accent-hover-color": "#a23939",
            "--accent-focus-color": "#8b3737",
            "--buffer-tree-selected-light": "#ded3d3",
            "--block-light-background": "#faebeb",

            // Dark mode.
            "--accent-dark-color": "#651b1b",
            "--accent-dark-hover-color": "#751f1f",
            "--buffer-tree-selected-dark": "#422424",
            "--editor-dark-background": "#2b1d1d",
            "--block-dark-even-background": "#372525",
            "--block-dark-odd-background": "#4b2525",
            "--tab-dark-blurred-background": "#381e1e",
            "--status-dark-background": "#1a0f0f",
            "--math-dark-color": "#cd9898",
        },
    },
    {
        id: "orange",
        label: "Orange",
        swatch: "#ce7c29",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#ce7c29",
            "--accent-hover-color": "#a26e39",
            "--accent-focus-color": "#8b6137",
            "--buffer-tree-selected-light": "#ded9d3",
            "--block-light-background": "#faf2eb",

            // Dark mode.
            "--accent-dark-color": "#65401b",
            "--accent-dark-hover-color": "#754a1f",
            "--buffer-tree-selected-dark": "#423324",
            "--editor-dark-background": "#2b241d",
            "--block-dark-even-background": "#372e25",
            "--block-dark-odd-background": "#4b3825",
            "--tab-dark-blurred-background": "#382b1e",
            "--status-dark-background": "#1a140f",
            "--math-dark-color": "#cdb398",
        },
    },
    {
        id: "yellow",
        label: "Yellow",
        swatch: "#dfb52e",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#af8b19",
            "--accent-hover-color": "#a28d39",
            "--accent-focus-color": "#8b7a37",
            "--buffer-tree-selected-light": "#dedcd3",
            "--block-light-background": "#faf7eb",

            // Dark mode.
            "--accent-dark-color": "#65561b",
            "--accent-dark-hover-color": "#75641f",
            "--buffer-tree-selected-dark": "#423c24",
            "--editor-dark-background": "#2b281d",
            "--block-dark-even-background": "#373325",
            "--block-dark-odd-background": "#4b4425",
            "--tab-dark-blurred-background": "#38331e",
            "--status-dark-background": "#1a170f",
            "--math-dark-color": "#cdc298",
        },
    },
    {
        id: "green",
        label: "Green",
        swatch: "#48b57e",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#48b57e",
            "--accent-hover-color": "#39a273",
            "--accent-focus-color": "#378b65",
            "--buffer-tree-selected-light": "#d3ded9",
            "--block-light-background": "#ebfaf3",

            // Dark mode.
            "--accent-dark-color": "#1b6543",
            "--accent-dark-hover-color": "#1f754e",
            "--buffer-tree-selected-dark": "#244234",
            "--editor-dark-background": "#1d2b24",
            "--block-dark-even-background": "#25372f",
            "--block-dark-odd-background": "#254b3a",
            "--tab-dark-blurred-background": "#1e382d",
            "--status-dark-background": "#0f1a15",
            "--math-dark-color": "#98cdb5",
        },
    },
    {
        id: "blue",
        label: "Blue",
        swatch: "#428bd1",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#428bd1",
            "--accent-hover-color": "#396ea2",
            "--accent-focus-color": "#37618b",
            "--buffer-tree-selected-light": "#d3d9de",
            "--block-light-background": "#ebf2fa",

            // Dark mode.
            "--accent-dark-color": "#1b4065",
            "--accent-dark-hover-color": "#1f4a75",
            "--buffer-tree-selected-dark": "#243342",
            "--editor-dark-background": "#1d242b",
            "--block-dark-even-background": "#252e37",
            "--block-dark-odd-background": "#25384b",
            "--tab-dark-blurred-background": "#1e2b38",
            "--status-dark-background": "#0f141a",
            "--math-dark-color": "#98b3cd",
        },
    },
    {
        id: "indigo",
        label: "Indigo",
        swatch: "#6a68cf",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#6a68cf",
            "--accent-hover-color": "#3d39a2",
            "--accent-focus-color": "#3a378b",
            "--buffer-tree-selected-light": "#d4d3de",
            "--block-light-background": "#ebebfa",

            // Dark mode.
            "--accent-dark-color": "#1d1b65",
            "--accent-dark-hover-color": "#221f75",
            "--buffer-tree-selected-dark": "#252442",
            "--editor-dark-background": "#1d1d2b",
            "--block-dark-even-background": "#262537",
            "--block-dark-odd-background": "#26254b",
            "--tab-dark-blurred-background": "#1f1e38",
            "--status-dark-background": "#100f1a",
            "--math-dark-color": "#9a98cd",
        },
    },
    {
        id: "violet",
        label: "Violet",
        swatch: "#aa62c8",
        styles: {
            // Light mode and shared accents (focus rings, buttons, math results).
            "--accent-color": "#aa62c8",
            "--accent-hover-color": "#8339a2",
            "--accent-focus-color": "#72378b",
            "--buffer-tree-selected-light": "#dbd3de",
            "--block-light-background": "#f5ebfa",

            // Dark mode.
            "--accent-dark-color": "#4f1b65",
            "--accent-dark-hover-color": "#5b1f75",
            "--buffer-tree-selected-dark": "#392442",
            "--editor-dark-background": "#271d2b",
            "--block-dark-even-background": "#312537",
            "--block-dark-odd-background": "#40254b",
            "--tab-dark-blurred-background": "#311e38",
            "--status-dark-background": "#160f1a",
            "--math-dark-color": "#bd98cd",
        },
    },
]

export function normalizeBufferColor(color) {
    return BUFFER_COLORS.some(option => option.id === color) ? color : "grey"
}

export function getBufferColorStyles(color) {
    return BUFFER_COLORS.find(option => option.id === normalizeBufferColor(color)).styles
}
