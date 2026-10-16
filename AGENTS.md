# Agent instructions

This repository is a personal fork of Heynote, customized for its owner.

## Development environment

- You are working inside the project's Linux devcontainer, configured in
  `.devcontainer/devcontainer.json`. The repository is mounted at `/workspace`.
- Run development commands directly in the container. See the **Dev container**
  section of `README.md` for setup and preview details.
- Container setup installs npm dependencies from `package-lock.json` and the
  Playwright browsers. `node_modules` uses a dedicated Docker volume.
- This environment runs the Linux app; macOS-specific behavior, signing, and
  packaging require validation on macOS.

## Common commands

- `npm run dev`: start the Electron app; view the desktop on forwarded port 6080.
- `npm run webapp:dev -- --host 0.0.0.0`: start the browser preview on port 5173.
- `npm run test:main -- --run`: run main-process unit tests once.
- `npm test -- --workers=2`: run Playwright browser tests.
- `xvfb-run -a npm run test:e2e -- --workers=1`: run Electron integration tests.
- `npx vite build`: build the renderer, main process, and preloads.

Run checks relevant to the changes being made.
