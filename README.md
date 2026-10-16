# Heynote

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/heyman/heynote)](https://github.com/heyman/heynote/releases)
[![Build Status](https://github.com/heyman/heynote/workflows/Tests/badge.svg)](https://github.com/heyman/heynote/actions?query=workflow%3ATests)

<img src="https://heynote.com/img/logo.png" style="width:79px;">

## General Information

- [Website](https://heynote.com)
- [Documentation](https://heynote.com/docs/)
- [Changelog](https://heynote.com/docs/changelog/)

Heynote is a scratchpad and note-taking app for developers and power users. It functions as a large persistent text buffer where you can write down anything you like. Works great for that Slack message you don't want to accidentally send, a JSON response from an API you're working with, notes from a meeting, your daily to-do list, etc. 

Heynote buffers are divided into blocks, and each block can have its own Language set (e.g. JavaScript, JSON, Markdown, etc.). This gives you syntax highlighting and lets you auto-format that JSON response. Just hit `Ctrl/Cmd + Enter` to create a new block.

Available for Mac, Windows, and Linux.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://heynote.com/img/dark/screenshot3.png">
  <img src="https://heynote.com/img/light/screenshot3.png" width="851" alt="New sidebar buffer tree feature">
</picture>

## Features

-   Persistent text buffers
-   Block-based
-   Inline images
-   Multiple buffers in tabs
-   Search (single and multi buffer)
-   Math/Calculator mode
-   Currency conversion
-   Syntax highlighting:

    C++, C#, Clojure, CSS, Elixir, Erlang, Dart, Go, Groovy, HTML, Java, JavaScript, JSX, Kotlin, TypeScript, TOML, TSX, JSON, Lezer, Markdown, Mermaid, PHP, Python, Ruby, Rust, Scala, Shell, SQL, Swift, Vue, XML, YAML
    
-   Language auto-detection
-   Auto-formatting
-   Multi-cursor editing
-   Dark & Light themes
-   Option to set a global hotkey to show/hide the app
-   Default, Emacs-like or custom key bindings
-   Spellchecking


## Documentation

[Documentation](https://heynote.com/docs/) is available on the Heynote website.

## Development

To develop Heynote you need Node.js and you should (hopefully) just need to check out the code and then run:

```
> npm install
> npm run dev
```

### Dev container

Open the repository in VS Code and run **Dev Containers: Reopen in Container**
(requires Docker and the Dev Containers extension). Setup installs the locked npm
dependencies and Chromium, Firefox, and WebKit for Playwright. The container uses
Node.js 24 on Debian Bookworm and runs natively on Apple Silicon or Intel.

Run `npm run dev` in the container, then open forwarded port **6080** in the Ports
panel to see the Electron app. Connect with password `vscode`. The desktop is
provided by the [desktop-lite feature](https://github.com/devcontainers/features/tree/main/src/desktop-lite).
For a browser preview, run `npm run webapp:dev -- --host 0.0.0.0` and open
forwarded port **5173**.

Useful checks inside the container:

```sh
npm run test:main -- --run          # Main-process unit tests; exits when done
npm test -- --workers=2            # Chromium, Firefox, and WebKit tests
npx vite build                    # Build renderer, main process, and preloads
xvfb-run -a npm run test:e2e -- --workers=1  # Electron integration tests
```

The workspace is mounted at `/workspace`. A Docker volume keeps Linux
`node_modules` separate from host dependencies. Codex state lives in the ignored
`.codex/` directory, matching the reference setup. On first launch,
`.devcontainer/.env.example` is copied to the ignored `.devcontainer/.env` for
optional environment variables; no API keys are required. `postCreateCommand`
automatically installs dependencies from `package-lock.json` and the matching
Playwright browsers whenever the container is created or rebuilt.

This runs the Linux app. macOS-specific integration, signing, and packaging still
need to be checked on macOS.

### Run Tests

To run the tests:

```
> npm run test
```

To run the tests in the Playwright UI:

```
> npm run test:ui
```


### Contributions

I'm happy to merge contributions that fit my vision for the app. Bug fixes are always welcome. 


## FAQ

### Where is the buffer data stored?

See the [documentation](https://heynote.com/docs/#user-content-the-notes-library).

### Can you make a mobile app?

No, at the moment this is out of scope, sorry.

### What are the default keyboard shortcuts?

See the [documentation](https://heynote.com/docs/#user-content-default-key-bindings).


## Thanks!

Heynote is built upon [CodeMirror](https://codemirror.net/), [Vue](https://vuejs.org/), [Electron](https://www.electronjs.org/), [Math.js](https://mathjs.org/), [Prettier](https://prettier.io/) and other great open-source projects.

