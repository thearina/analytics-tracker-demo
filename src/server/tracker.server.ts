import "dotenv/config";
import express from "express";
import cors from "cors";
import { resolve as pathResolve } from "path";
import { isTracksBatch } from "./utils.js";
import { insertTracksBatch } from "./db.js";
import { cwd } from "node:process";
import { SendFileError } from "./types";

const trackerApp = express();
const TRACKER_PORT = 8888;
const WEB_PORT = Number(process.env.WEB_PORT) || 50000;

// Build path to compiled client tracker using current working directory
// Assumes process started from project root so dist/client/tracker.js exists after build
const TRACKER_SCRIPT_PATH = pathResolve(cwd(), "dist", "client", "tracker.js");

trackerApp.use(
  cors({
    origin: `http://localhost:${WEB_PORT}`,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

trackerApp.get("/tracker", async (req, res) => {
  res.sendFile(TRACKER_SCRIPT_PATH, (err) => {
    if (!err) return;

    const e = err as SendFileError;
    const status =
      e.status ?? e.statusCode ?? (e.code === "ENOENT" ? 404 : 500);

    res
      .status(status)
      .type("text/plain")
      .send(
        status === 404 ? "Tracker is not built" : "Failed to send tracker.js",
      );
  });
});

trackerApp.post("/track", express.text({ type: "text/plain" }), (req, res) => {
  const raw = req.body;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  if (!isTracksBatch(parsed)) {
    return res
      .status(422)
      .json({ error: "Body must be an array of track events" });
  }
  res.sendStatus(200);

  // Fire-and-forget insert into MongoDB (via Mongoose); do not block response
  void insertTracksBatch(parsed);
});

trackerApp.listen(TRACKER_PORT, () => {
  console.log(
    `Tracker server listening on http://localhost:${TRACKER_PORT}/tracker`,
  );
});
