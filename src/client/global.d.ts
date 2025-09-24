export {};

type QueuedCall = [event: string, ...tags: string[]];

declare global {
  interface Window {
    tracker?: {
      track(event: string, ...tags: string[]): void;
      queue?: QueuedCall[];
    };
  }
}
