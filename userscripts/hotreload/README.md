# Fluxer CSS Hot Reload

This folder holds 2 javascript files. `userscript.js` should be inserted into something like Violentmonkey, and the other `index.js` should be ran with node.js, bun or other similar tools.

## How It Works

### Server (index.js)
A Node.js server that monitors your `mauve.css` file and pushes updates to connected clients via Server-Sent Events (SSE):
- Watches for file changes to `mauve.css`
- Streams the updated CSS to all connected browsers
- Runs on `http://127.0.0.1:6934/css` by default

### Userscript (userscript.js)
A Tampermonkey/Greasemonkey script that injects CSS into the Fluxer app:
- Connects to the local SSE server
- Automatically applies new CSS when updates arrive
- Auto-reconnects if the connection drops
- Injects styles via a `<style>` element in the page head

## Setup

1. **Start the server** in this directory:
   ```bash
   node index.js
   ```

2. **Install the userscript** in your browser:
   - Open [userscript.js](userscript.js) and copy its contents
   - Paste into Violentmonkey/Tampermonkey/Greasemonkey's "Create Script" dialog
   - Or use your userscript manager's import feature

3. **Edit your CSS**:
   - Open up `mauve.css` in vs code or any other ide and start editing.
   - Saving will automatically apply the theme to `web.fluxer.app`