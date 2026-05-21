#!/usr/bin/env node
// Minimal static file server for the macos-web showcase.
// Needed because ES modules (<script type="module">) refuse to load over
// file:// — browsers require an HTTP origin. No build step, no deps.
//
// Usage:  node scripts/serve.mjs [port] [root]
// Defaults: port 8000, root examples/macos-web

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const port = Number(process.argv[2] ?? 8000);
const root = resolve(process.argv[3] ?? "examples/macos-web");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".woff2":"font/woff2",
};

createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";

    const filePath = resolve(join(root, urlPath));
    // Reject anything that escapes the root directory.
    if (!filePath.startsWith(root + sep) && filePath !== root) {
      res.writeHead(403); res.end("forbidden"); return;
    }

    const info = await stat(filePath);
    const targetPath = info.isDirectory() ? join(filePath, "index.html") : filePath;
    const data = await readFile(targetPath);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(targetPath)] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404); res.end("not found");
  }
}).listen(port, () => {
  console.log(`liquid-glass dev server  →  http://localhost:${port}  (root: ${root})`);
});
