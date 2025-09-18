import { type Model, model, models, Schema, connect } from "mongoose";
import type { TracksBatch, Track } from "./types";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_DB = process.env.MONGODB_DB || "analyticstracker";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "tracks";

const connectPromise = connect(MONGODB_URI, {
  dbName: MONGODB_DB,
  serverSelectionTimeoutMS: 3000,
});

void connectPromise
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGODB_URI}/${MONGODB_DB}`);
  })
  // Surface connection failures early to avoid unhandled rejection noise
  .catch((err) => {
    console.error("MongoDB connection failed:", err?.message || err);
  });

const TrackSchema = new Schema<Track>({
  event: { type: String, required: true },
  tags: { type: [String], required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  ts: { type: Number, required: true },
});

const TrackModel: Model<Track> =
  models.Track ?? model<Track>("Track", TrackSchema, MONGODB_COLLECTION);

export async function insertTracksBatch(data: TracksBatch): Promise<void> {
  try {
    await connectPromise;
    const insertedDocs = await TrackModel.insertMany(data);
    console.log(
      `Inserted ${insertedDocs.length} track${insertedDocs.length === 1 ? "" : "s"}`,
    );
  } catch (err) {
    console.error("Failed to insert tracks batch:", err);
  }
}
