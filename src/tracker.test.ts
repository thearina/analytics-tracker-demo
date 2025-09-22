import { describe, it, expect, beforeEach } from "vitest";
import { EventTracker } from "./tracker.js";

describe("EventTracker", () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-ignore - accessing private static property for testing
    EventTracker.instance = undefined;
    // @ts-ignore - accessing global window property for testing
    window.tracker = undefined;
  });

  describe("Singleton behavior", () => {
    it("should return the same instance when initialize is called multiple times", () => {
      EventTracker.initialize("https://api.example.com/track");
      const tracker1 = window.tracker;

      EventTracker.initialize("https://api.example.com/track");
      const tracker2 = window.tracker;

      expect(tracker1).toBe(tracker2);
    });

    it("should ignore different endpoints after first initialization", () => {
      EventTracker.initialize("https://api1.com/track");
      const tracker1 = window.tracker;

      EventTracker.initialize("https://api2.com/track");
      const tracker2 = window.tracker;

      // Both should be the same instance
      expect(tracker1).toBe(tracker2);

      // Should use the endpoint from the first call
      // @ts-ignore - accessing private property for testing
      expect(tracker1.config.endpoint).toBe("https://api1.com/track");
    });
  });
});
