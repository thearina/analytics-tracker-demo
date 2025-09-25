export {};

import type { Tracker } from "./tracker.types.js";

declare global {
  interface Window {
    tracker?: Tracker;
  }
}
