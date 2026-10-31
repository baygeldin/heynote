# Changelog

Custom changes in this personal fork, starting from upstream Heynote 2.9.1
(`c301e42`). Upstream release history is in [docs/changelog.md](docs/changelog.md).

Entries are grouped by date, newest first. Dates refer to when changes were
committed in this fork, rather than upstream release dates. Related changes are
summarized by their resulting behavior.

## 2026-10-31

### Window behavior

- Add a custom minimize button at the right of the macOS tab bar, available with
  tabs shown or hidden. It minimizes the window to the Dock while keeping the
  native traffic light buttons hidden.

## 2026-10-17

### Window behavior

- Keep the window always on top. Remove the pin toggle, its setting, and the
  corresponding keyboard command; migrate existing preferences and shortcuts.
  Disable fullscreen and ignore previously saved fullscreen state.
- On macOS, keep the window on the Space where it was shown. Summoning it with
  the global shortcut brings it to the active Space; switching Spaces alone
  leaves it in place. Add a native macOS helper for this behavior.
- Hide the macOS close, minimize, and maximize buttons and remove their reserved
  space from the tab bar.

### Colors and themes

- Add a color picker to each buffer tab, including a picker when tabs are hidden.
  Save each buffer's choice in its note metadata so it survives reopening.
- Provide seven schemes: Grey (the default), Red, Orange, Green, Blue, Purple,
  and Pink. Missing or unsupported saved colors fall back to Grey.
- Apply the active buffer's scheme across the editor and surrounding interface,
  with matching tab swatches, status bar colors, and subtly alternating block
  backgrounds in both light and dark modes.
- Give each scheme its own syntax palette, adapted from Atom One, GitHub,
  Gruvbox Material, Everforest, Kanagawa, Catppuccin, or Rosé Pine. Include the
  original theme license notices and checks for syntax text contrast.
- Allow only one color picker at a time. Opening a picker activates its buffer;
  support keyboard navigation and preserve edits when changing colors.
- Add a status bar button to switch directly between light and dark mode.

### Spellchecking

- Restore native spelling suggestions in the editor's context menu, including
  on macOS. Right-click a misspelled word to replace it or add it to the
  dictionary.
- Limit spellchecking to Plain Text and Markdown prose. Exclude programming
  language and Math blocks, plus inline, fenced, and indented Markdown code.
  Update the spelling scope when content, block language, or settings change.

### Development

- Add a Linux devcontainer with Node.js 24, locked npm dependencies, Playwright
  browsers, and a desktop preview on port 6080. Keep Linux dependencies in a
  Docker volume separate from host dependencies.
- Add `npm run build:mac` for local Apple Silicon DMG builds with ad hoc signing,
  without notarization or publishing. Build and package the native window helper
  on macOS, and document installation in [README.md](README.md).
- Centralize editable UI and syntax palettes with shared defaults and overrides
  for each scheme and mode. Document customization in
  [src/theme/README.md](src/theme/README.md).
- Add regression coverage for window visibility, buffer colors, syntax palettes,
  and spellchecking in the main-process, browser, and Electron test suites.
- Add workspace colors for VS Code and repository guidance for coding agents.
