type QueuedCall = [event: string, ...tags: string[]];

export interface Tracker {
  track(event: string, ...tags: string[]): void;
  queue?: QueuedCall[];
}
