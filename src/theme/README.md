# Customizing colors

`defaults.js` contains the complete light and dark palettes. Each palette has
`ui` and `syntax` groups with named color roles. Edit these defaults to change
every scheme that inherits a role.

Each of the eight schemes has its own file in `schemes/`. A scheme contains its
saved `id`, display `label`, picker `swatch`, and optional color overrides:

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
The picker order is Grey, Red, Orange, Green, Teal, Blue, Purple, Pink.
Missing or unrecognized scheme IDs fall back to Grey.
Choosing a color saves its current ID.
