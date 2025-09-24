import "dotenv/config";
import express from "express";
import { resolve as pathResolve } from "path";
import { cwd } from "node:process";

const webApp = express();
const WEB_PORT = Number(process.env.WEB_PORT) || 50000;

const DEMO_PAGE_PATH = pathResolve(cwd(), "src", "static", "index.html");

webApp.get("/", (req, res) => {
  res.redirect("/1.html");
});

["/1.html", "/2.html", "/3.html"].forEach((route) => {
  webApp.get(route, (req, res) => {
    res.sendFile(DEMO_PAGE_PATH);
  });
});

webApp.listen(WEB_PORT, () => {
  console.log(`Web server listening on http://localhost:${WEB_PORT}`);
});
