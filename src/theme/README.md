# Customizing colors

`defaults.js` contains the complete light and dark palettes. Each palette has
`ui` and `syntax` groups with named color roles. Edit these defaults to change
every scheme that inherits a role.

Each of the seven schemes has its own file in `schemes/`. A scheme contains its
saved `id`, display `label`, and optional color overrides. Picker and tab swatches
use the resolved `ui.statusBackground` for the current mode, so they always match
that scheme's footer. There is no separate swatch color to maintain.

```js
shared: {
    syntax: { keyword: "#123456" }, // Both modes, for this scheme.
},
light: {
    ui: { blockOdd: "#fff0f0" },
},
dark: {
    syntax: { keyword: "#abcdef" }, // Takes precedence over shared.
},
```

Resolution happens independently for each role: mode defaults, then the scheme's
`shared` overrides, then its `light` or `dark` overrides. Omit a role to inherit it;
an empty group inherits everything. Grey inherits the shared defaults and can
have its own overrides without affecting other schemes.

All color values are explicit CSS colors. `inherit` keeps a syntax role the same
color as its surrounding text. Even roles that share a default color can be
overridden independently. `function` colors function calls; `functionDefinition`
colors declarations. The two block backgrounds are `ui.blockEven` and `ui.blockOdd`.

`types.ts` lists the available roles. Palette files use TypeScript checking via
JSDoc, so `npx vue-tsc --noEmit` catches misspelled overrides and missing defaults.
When adding a role, add it to both mode defaults and wire it into its consumer.

`resolve.js` merges the groups and maps roles to CSS variables, such as
`ui.blockOdd` → `--ui-block-odd` and `syntax.keyword` → `--syntax-keyword`.
`apply.js` applies a complete palette whenever the active scheme or mode changes.
The syntax-tag mapping and font/decoration rules live in
`src/editor/theme/syntax.js`; editor layout stays in the other editor theme files.

Scratchpad files continue to store only the scheme ID in their `color` metadata.
The picker order is Grey, Red, Orange, Green, Blue, Purple, Pink.
Missing or unrecognized scheme IDs fall back to Grey.
Choosing a color saves its current ID.

## Main palettes

These are custom muted palettes: coral Red, amber Orange, teal Green, azure Blue,
violet Purple, and rose Pink, plus neutral Grey. Names and saved IDs stay broad
so existing notes keep their chosen theme.

The design follows [Radix Colors' separation of subtle reading surfaces and solid
UI accents](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale).
[Catppuccin](https://catppuccin.com/palette/) was also considered; its pastel
accents suit syntax, but its shared neutral backgrounds do not provide the six
distinct tinted writing surfaces wanted here. These colors are custom values,
not copies of either palette.

[OKLCH](https://bottosson.github.io/posts/oklab/) was used to keep perceived
lightness and chroma similar across families before converting to explicit sRGB
hex values. Hue angles are 30°, 70°, 170°, 245°, 295°, and 345° respectively.
For even/odd blocks, light mode uses lightness 0.966/0.948 and chroma 0.012/0.018;
dark mode uses lightness 0.265/0.285 and chroma 0.024/0.026.
Grey uses zero chroma. Footer lightness is 0.54 in light
mode and 0.43 in dark mode, with stronger chroma than the reading surfaces.
Green's footer chroma is reduced to stay within sRGB.

| Theme | Mode | Footer / swatch | Odd blocks | Even blocks |
| --- | --- | --- | --- | --- |
| Grey | Light | `#6f6f6f` | `#eeeeee` | `#f4f4f4` |
| Grey | Dark | `#505050` | `#2a2a2a` | `#252525` |
| Red | Light | `#a55347` | `#faeae7` | `#fcf1ef` |
| Red | Dark | `#783c33` | `#362522` | `#30211e` |
| Orange | Light | `#976213` | `#f6ece1` | `#f9f3eb` |
| Orange | Dark | `#6d4610` | `#33281c` | `#2d2318` |
| Green | Light | `#317f67` | `#e3f2ec` | `#ecf7f2` |
| Green | Dark | `#245b4a` | `#1d2e28` | `#192923` |
| Blue | Light | `#2d74aa` | `#e4eff9` | `#edf5fc` |
| Blue | Dark | `#21547b` | `#1f2c36` | `#1b2730` |
| Purple | Light | `#7460a7` | `#eeecf9` | `#f4f2fb` |
| Purple | Dark | `#534579` | `#2b2836` | `#262330` |
| Pink | Light | `#9b527d` | `#f7e9f0` | `#faf1f6` |
| Pink | Dark | `#703b5a` | `#34252d` | `#2e2128` |

Block-to-block contrast is approximately 1.05–1.07:1. This is a local design
target for gentle alternation, not an accessibility requirement. Normal editor
text, footer text, and math results meet the [WCAG minimum text contrast of
4.5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) in both
modes. This does not assert conformance for every syntax token or UI state.
Related accents, selections, borders, tabs, and math surfaces use the same family.
Footer labels use the palette text color without additional transparency, and
footer hover states darken the background to preserve text contrast.
Syntax roles continue to inherit independently.
