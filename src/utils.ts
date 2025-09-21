import { z } from "zod";
import type { Track, TracksBatch } from "./types";

export const TrackSchema = z.object({
  event: z.string(),
  tags: z.array(z.string()),
  url: z.string(),
  title: z.string(),
  ts: z.number().int(),
});

export const TracksBatchSchema = z.array(TrackSchema).min(1);

export function isTrack(obj: unknown): obj is Track {
  return TrackSchema.safeParse(obj).success;
}

export function isTracksBatch(payload: unknown): payload is TracksBatch {
  return TracksBatchSchema.safeParse(payload).success;
}
