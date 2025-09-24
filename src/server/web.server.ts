import "dotenv/config";
import express from "express";
import { resolve as pathResolve } from "path";
import { cwd } from "node:process";
import { SendFileError } from "./types";

const webApp = express();
const WEB_PORT = Number(process.env.WEB_PORT) || 50000;

const DEMO_PAGE_PATH = pathResolve(cwd(), "src", "static", "index.html");

webApp.get("/", (req, res) => {
  res.redirect("/1.html");
});

["/1.html", "/2.html", "/3.html"].forEach((route) => {
  webApp.get(route, (req, res) => {
    res.sendFile(DEMO_PAGE_PATH, (err) => {
      if (!err) return;

      const e = err as SendFileError;
      const status =
        e.status ?? e.statusCode ?? (e.code === "ENOENT" ? 404 : 500);

      res
        .status(status)
        .type("text/plain")
        .send(
          status === 404 ? "index.html not found" : "Failed to send index.html",
        );
    });
  });
});

webApp.listen(WEB_PORT, () => {
  console.log(`Web server listening on http://localhost:${WEB_PORT}`);
});
