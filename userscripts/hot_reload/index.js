const path = require("path");
const http = require("http");
const fs = require("fs");

const PORT = 6934;

const cssPath = path.join(
  __dirname,
  "..",
  "..",
  "themes",
  "mocha",
  "mauve.css",
);

const clients = new Set();
let updateCount = 0;

http
  .createServer((req, res) => {
    if (req.url === "/css") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      clients.add(res);
      console.log(`[SSE] Client connected (${clients.size} active)`);
      req.on("close", () => {
        clients.delete(res);
        console.log(`[SSE] Client disconnected (${clients.size} active)`);
      });

      fs.readFile(cssPath, "utf-8", (err, data) => {
        if (!err) res.write(`data: ${JSON.stringify(data)}\n\n`);
      });
    } else {
      res.writeHead(404).end();
    }
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`SSE server running on http://127.0.0.1:${PORT}/css`);
  });

fs.watch(cssPath, () => {
  fs.readFile(cssPath, "utf-8", (err, data) => {
    if (err) {
      console.error(`[Watch] Failed to read CSS:`, err.message);
      return;
    }
    const msg = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) client.write(msg);
    updateCount++;
    console.log(
      `[Watch] CSS pushed to ${clients.size} client(s) (update #${updateCount})`,
    );
  });
});
