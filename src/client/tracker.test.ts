import { describe, it, expect, beforeEach, vi } from "vitest";
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

  describe("Temporary tracker replay", () => {
    it("should replay events from temporary tracker when real tracker initializes", () => {
      // Set up a temporary tracker with queued events AFTER beforeEach has run
      // Use only 2 events to avoid immediate flushing (threshold is 3)
      const mockTrack = vi.fn();
      const temporaryTracker = {
        track: mockTrack,
        queue: [
          ["page_view", "home"],
          ["button_click", "cta"],
        ],
      };

      // Manually set the temporary tracker
      window.tracker = temporaryTracker as any;

      // Initialize the real tracker
      EventTracker.initialize("https://api.example.com/track");
      const realTracker = window.tracker;

      // Verify the real tracker has the queued events in its buffer immediately after initialization
      // @ts-ignore - accessing private property for testing
      expect(realTracker.events).toHaveLength(2);

      // Verify the events have the correct structure
      // @ts-ignore - accessing private property for testing
      const events = realTracker.events;
      expect(events[0].event).toBe("page_view");
      expect(events[0].tags).toEqual(["home"]);
      expect(events[1].event).toBe("button_click");
      expect(events[1].tags).toEqual(["cta"]);
    });

    it("should handle malformed queue gracefully", () => {
      // Set up a temporary tracker with malformed queue
      // Use only 2 valid events to avoid immediate flushing (threshold is 3)
      const mockTrack = vi.fn();
      window.tracker = {
        track: mockTrack,
        queue: [
          ["valid_event", "tag1"],
          [], // empty array
          ["another_valid_event", "tag2"],
          null, // null entry
        ] as any, // Allow malformed entries for testing
      };

      // Initialize the real tracker
      EventTracker.initialize("https://api.example.com/track");
      const realTracker = window.tracker;

      // Should only have the valid events (2 out of 4)
      // @ts-ignore - accessing private property for testing
      expect(realTracker.events).toHaveLength(2);

      // @ts-ignore - accessing private property for testing
      const events = realTracker.events;
      expect(events[0].event).toBe("valid_event");
      expect(events[0].tags).toEqual(["tag1"]);
      expect(events[1].event).toBe("another_valid_event");
      expect(events[1].tags).toEqual(["tag2"]);
    });

    it("should handle missing queue property", () => {
      // Set up a temporary tracker without queue
      const mockTrack = vi.fn();
      window.tracker = {
        track: mockTrack,
        // no queue property
      };

      // Initialize the real tracker
      EventTracker.initialize("https://api.example.com/track");
      const realTracker = window.tracker;

      // Should have no events since there was no queue
      // @ts-ignore - accessing private property for testing
      expect(realTracker.events).toHaveLength(0);
    });

    it("should initialize normally when no window.tracker exists", () => {
      // Ensure no temporary tracker exists
      window.tracker = undefined;

      // Initialize the real tracker
      EventTracker.initialize("https://api.example.com/track");
      const realTracker = window.tracker;

      // Should be a valid EventTracker instance
      expect(realTracker).toBeDefined();
      expect(realTracker).toBeInstanceOf(EventTracker);

      // Should have no events since there was no temporary tracker
      // @ts-ignore - accessing private property for testing
      expect(realTracker.events).toHaveLength(0);

      // Should have the correct endpoint
      // @ts-ignore - accessing private property for testing
      expect(realTracker.config.endpoint).toBe("https://api.example.com/track");
    });
  });
});
