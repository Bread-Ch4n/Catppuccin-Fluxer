# Catppuccin Fluxer Themes

[Catppuccin](https://catppuccin.com/) color scheme themes for [Fluxer](https://web.fluxer.app/).

## Installation

### Quick Install (Recommended)
Install the auto-update userscript to keep your theme automatically updated:

1. Ensure you have a userscript manager installed (e.g., [Tampermonkey](https://www.tampermonkey.net/))
2. Click to install: [Catppuccin Fluxer Auto-updater](https://raw.githubusercontent.com/Bread-Ch4n/Catppuccin-Fluxer/refs/heads/main/userscripts/auto_update.user.js)
3. Confirm the installation in your userscript manager
4. Visit https://web.fluxer.app/ — the theme will be automatically applied!

### Manual Install
1. Copy the contents of any `accent.css` file within the [themes](themes) folder
2. In Fluxer, go to **Settings → Look & Feel → Custom Theme Tokens → Custom CSS Overrides**
3. Paste the CSS and save

## Development

### Prerequisites

- [Bun](https://bun.sh/) — used as the package manager and task runner
- [Whiskers](https://github.com/catppuccin/whiskers) — used to generate themes from templates

### Setup

```sh
bun i
bun run dev
```

This watches for changes in [`src/styles/`](src/styles/) and regenerates [`src/out.css`](src/out.css), which is then used by [Whiskers](https://github.com/catppuccin/whiskers) to generate all flavors in the [`themes/`](themes) directory.

### Hot Reload

For automatic theme reloading in the browser during development, see the [Hot Reload README](userscripts/hot_reload/README.md).