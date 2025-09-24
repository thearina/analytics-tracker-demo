export interface Track {
  event: string;
  tags: string[];
  url: string;
  title: string;
  ts: number;
}

// Not empty array of Tracks
export type TracksBatch = [Track, ...Track[]];
