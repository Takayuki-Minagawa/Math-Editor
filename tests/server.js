const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    if (!/^(index\.html|(?:css|js|assets)\/[^\0]+)$/.test(relative)) {
      response.writeHead(404).end();
      return;
    }
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    const body = await fs.readFile(file);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    }).end(body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173, "127.0.0.1", () => {
  console.log("Math Editor test server: http://127.0.0.1:4173");
});
