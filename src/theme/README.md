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

## Syntax references

Each scheme adopts a different established editor theme family, with a matched
light and dark variant. The choices pair each family's token relationships with
our existing tinted surfaces:

| Scheme | Light reference | Dark reference | Why this pairing |
| --- | --- | --- | --- |
| Grey | [Atom One Light](https://github.com/atom/one-light-syntax) | [Atom One Dark](https://github.com/atom/one-dark-syntax) | Balanced violet keywords, blue functions, green strings, and warm literals on neutral grey. |
| Red | [GitHub Light Default](https://github.com/primer/github-vscode-theme) | GitHub Dark Default | Coral/red keywords anchor the warm surfaces; purple functions and blue strings provide separation. |
| Orange | [Gruvbox Material Light](https://github.com/sainnhe/gruvbox-material) | Gruvbox Material Dark | Warm foregrounds, earthy green strings/functions, ochre types, and soft coral keywords suit amber. |
| Green | [Everforest Light](https://github.com/sainnhe/everforest) | Everforest Dark | Green functions and aqua strings complement teal; red keywords and purple numbers remain distinct. |
| Blue | [Kanagawa Lotus](https://github.com/rebelot/kanagawa.nvim) | Kanagawa Wave | Blue functions, violet keywords, green strings, and pink numbers suit the cool surfaces. |
| Purple | [Catppuccin Latte](https://github.com/catppuccin/nvim) | Catppuccin Mocha | Mauve keywords, blue functions, peach literals, and lavender properties complement violet. |
| Pink | [Rosé Pine Dawn](https://github.com/rose-pine/neovim) | Rosé Pine Moon | Rose functions, gold strings, pine keywords, and iris annotations complement rose. |

The palette and syntax-role assignments were checked against the upstream
implementations, rather than inferred from screenshots:

- Atom One: [`colors.less`](https://github.com/atom/one-dark-syntax/blob/master/styles/colors.less) and [`syntax/_base.less`](https://github.com/atom/one-dark-syntax/blob/master/styles/syntax/_base.less), with their One Light counterparts.
- GitHub: [`src/theme.js`](https://github.com/primer/github-vscode-theme/blob/main/src/theme.js), using the light/dark color scales in Primer Primitives 7.10.0.
- Gruvbox Material: [`autoload/gruvbox_material.vim`](https://github.com/sainnhe/gruvbox-material/blob/master/autoload/gruvbox_material.vim) (`material` foreground) and [`colors/gruvbox-material.vim`](https://github.com/sainnhe/gruvbox-material/blob/master/colors/gruvbox-material.vim).
- Everforest: [`palette.md`](https://github.com/sainnhe/everforest/blob/master/palette.md), including its syntax semantics and Tree-sitter mappings.
- Kanagawa: [`colors.lua`](https://github.com/rebelot/kanagawa.nvim/blob/master/lua/kanagawa/colors.lua) and [`themes.lua`](https://github.com/rebelot/kanagawa.nvim/blob/master/lua/kanagawa/themes.lua), specifically `lotus.syn` and `wave.syn`.
- Catppuccin: [`palettes`](https://github.com/catppuccin/nvim/tree/main/lua/catppuccin/palettes), [`groups/syntax.lua`](https://github.com/catppuccin/nvim/blob/main/lua/catppuccin/groups/syntax.lua), and [`groups/treesitter.lua`](https://github.com/catppuccin/nvim/blob/main/lua/catppuccin/groups/treesitter.lua).
- Rosé Pine: [`palette.lua`](https://github.com/rose-pine/neovim/blob/main/lua/rose-pine/palette.lua) and [`rose-pine.lua`](https://github.com/rose-pine/neovim/blob/main/lua/rose-pine.lua), using Dawn and Moon.

These are adaptations for Heynote. Original token hues and semantic groupings
are retained where possible; lightness is adjusted in OKLCH when a color needs
more contrast on our backgrounds. Chroma is reduced only to stay within sRGB.
The adjustment target was 4.6:1; tests enforce at least 4.5:1 for every resolved
syntax foreground on both block colors, including the 4% active-line overlay.
This includes comments and punctuation. Selections and search overlays have
their own colors and are outside that contrast check.

`ui.editorText` adopts the reference foreground so ordinary identifiers and
uncolored text fit the syntax palette. Grey's One palettes live in `defaults.js`;
the other schemes specify every syntax role in their mode's `syntax` group.
Each role remains independently editable using the same override rules.
Function colors cover standalone functions and member calls. The language
grammar determines the available roles; JavaScript object-method declarations,
for example, receive `definitionProperty`, while calls receive `function`.
Markdown uses the same family's headings, links, and inline-code colors.
The editor's existing bold, italic, and underline behavior still applies.

Upstream MIT notices are included in [`public/theme-licenses.txt`](../../public/theme-licenses.txt),
which is copied into renderer and web builds.
