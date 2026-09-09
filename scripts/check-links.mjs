#!/usr/bin/env node
/**
 * Local internal link check (mirrors CI).
 * Usage: node scripts/check-links.mjs
 */
import { spawn } from "child_process";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PORT = 4173;

function waitForServer(ms = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - start > ms) reject(new Error("server timeout"));
        else setTimeout(tick, 250);
      });
    };
    tick();
  });
}

async function main() {
  const serve = spawn("npx", ["serve", "-s", ".", "-l", String(PORT)], {
    stdio: "ignore",
    cwd: root,
  });
  try {
    await waitForServer();
    const link = spawn(
      "npx",
      [
        "--yes",
        "linkinator@6",
        `http://127.0.0.1:${PORT}`,
        "--recurse",
        "--verbosity",
        "error",
        "--skip",
        "^(https?://(?!127\\.0\\.0\\.1).*)",
        "--timeout",
        "15000",
      ],
      { stdio: "inherit", cwd: root }
    );
    const code = await new Promise((r) => link.on("close", r));
    process.exit(code || 0);
  } finally {
    serve.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
