# Fluxer CSS Hot Reload

Automatically reload your CSS changes in the browser without refreshing the page. Perfect for live styling development.

## Prerequisites

- A Node.js environment (or [Bun](https://github.com/oven-sh/bun) for faster execution)
- A userscript manager
  like [Tampermonkey](https://github.com/Tampermonkey/tampermonkey), [Greasemonkey](https://github.com/greasemonkey/greasemonkey)
  or [Violentmonkey](https://github.com/violentmonkey)

## Setup

### Step 1: Start the development server

Run the `index.js` file with bun:

```bash
bun run index.js
```

The server will watch for changes to your `mauve.css` or selected file.

### Step 2: Install the userscript

Click [here](https://raw.githubusercontent.com/Bread-Ch4n/Catppuccin-Fluxer/refs/heads/main/userscripts/hot_reload/hot_reload.user.js)
to install the userscript to your browser, or manually add `hot_reload.user.js` to your userscript manager.

### Step 3: Start editing

Edit `mauve.css` or your selected file and your changes will automatically apply to the page without requiring a
refresh!

## Notes

- Make sure both your server and browser are on the same machine or network
- The userscript will inject and update your CSS in real-time