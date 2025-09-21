import "dotenv/config";
import express from "express";
import { resolve as pathResolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const webApp = express();
const WEB_PORT = Number(process.env.WEB_PORT) || 50000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticFilePath = pathResolve(__dirname, "../src/index.html");

webApp.get("/", (req, res) => {
  res.redirect("/1.html");
});

["/1.html", "/2.html", "/3.html"].forEach((route) => {
  webApp.get(route, (req, res) => {
    res.sendFile(staticFilePath);
  });
});

webApp.listen(WEB_PORT, () => {
  console.log(`Web server listening on http://localhost:${WEB_PORT}`);
});
