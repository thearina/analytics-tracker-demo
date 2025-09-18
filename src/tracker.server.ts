import "dotenv/config";
import express from "express";
import cors from "cors";
import { resolve as pathResolve } from "path";
import { readFile } from "fs/promises";
import { isTracksBatch } from "./utils";
import { insertTracksBatch } from "./db";

const trackerApp = express();
const TRACKER_PORT = 8888;
const WEB_PORT = Number(process.env.WEB_PORT) || 50000;

trackerApp.use(
  cors({
    origin: `http://localhost:${WEB_PORT}`,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

trackerApp.get("/tracker", async (req, res) => {
  try {
    const filePath = pathResolve(__dirname, "tracker.js");
    const js = await readFile(filePath, "utf8");
    res.type("application/javascript").send(js);
  } catch (e) {
    res.status(500).type("text/plain").send("Tracker is not built");
  }
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
