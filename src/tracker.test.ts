import { describe, it, expect } from "vitest";
import { EventTracker } from "./tracker";

describe("EventTracker", () => {
  describe("Singleton behavior", () => {
    it("should return the same instance when called multiple times", () => {
      const tracker1 = EventTracker.getInstance(
        "https://api.example.com/track",
      );
      const tracker2 = EventTracker.getInstance(
        "https://api.example.com/track",
      );

      expect(tracker1).toBe(tracker2);
    });

    it("should ignore different endpoints after first creation", () => {
      const tracker1 = EventTracker.getInstance("https://api1.com/track");

      // Should use the endpoint from the first call (which was already created at module load)
      // @ts-ignore - accessing private property for testing
      expect(tracker1.config.endpoint).toBe("http://localhost:8888/track");
    });
  });
});
