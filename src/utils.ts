import type { Track, TracksBatch } from "./types";

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

export function isTrack(obj: unknown): obj is Track {
  if (!isPlainObject(obj)) return false;

  if (typeof obj.event !== "string") return false;
  if (!Array.isArray(obj.tags)) return false;
  if (typeof obj.url !== "string") return false;
  if (typeof obj.title !== "string") return false;
  if (typeof obj.ts !== "number" || !Number.isInteger(obj.ts)) return false;

  for (const tag of obj.tags) {
    if (!(typeof tag === "string")) {
      return false;
    }
  }
  return true;
}

export function isTracksBatch(payload: unknown): payload is TracksBatch {
  if (!Array.isArray(payload)) return false;
  if (payload.length === 0) return false;
  for (let i = 0; i < payload.length; i++) {
    if (!isTrack(payload[i])) return false;
  }
  return true;
}
