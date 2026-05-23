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

// Alias: requests for /dist/* are served from <repo>/dist regardless of the
// chosen webRoot. examples/macos-web/styles.css imports `../../dist/tokens.css`
// at the file-system level, but in the browser that resolves to /dist/... —
// without this alias the path-escape guard 404s the generated tokens.
const distRoot = resolve("dist");

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

    // /dist/* maps to the repo-root dist/ so the showcase can @import
    // generated tokens via the relative path it uses on disk.
    let baseRoot = root;
    let mappedPath = urlPath;
    if (urlPath === "/dist" || urlPath.startsWith("/dist/")) {
      baseRoot = distRoot;
      mappedPath = urlPath.slice("/dist".length) || "/";
    }

    const filePath = resolve(join(baseRoot, mappedPath));
    // Reject anything that escapes its resolved root directory.
    if (!filePath.startsWith(baseRoot + sep) && filePath !== baseRoot) {
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
