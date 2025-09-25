type TrackArgs = [event: string, ...tags: string[]];

export interface Tracker {
  track(...trackArgs: TrackArgs): void;
  queue?: TrackArgs[];
}
