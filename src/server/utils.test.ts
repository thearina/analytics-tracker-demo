import { describe, it, expect } from "vitest";
import { isTrack, isTracksBatch } from "./utils.js";
import type { Track } from "./server.types.js";

describe("utils", () => {
  describe("isTrack", () => {
    const validTrack: Track = {
      event: "page_view",
      tags: ["homepage", "user"],
      url: "https://example.com",
      title: "Home Page",
      ts: 1234567890,
    };

    it("should return true for valid track", () => {
      expect(isTrack(validTrack)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isTrack(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isTrack(undefined)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isTrack("not a track")).toBe(false);
    });

    it("should return false for number", () => {
      expect(isTrack(123)).toBe(false);
    });

    it("should return false for array", () => {
      expect(isTrack([])).toBe(false);
    });

    it("should return false when event is missing", () => {
      const { event, ...trackWithoutEvent } = validTrack;
      expect(isTrack(trackWithoutEvent)).toBe(false);
    });

    it("should return false when event is not a string", () => {
      expect(isTrack({ ...validTrack, event: 123 })).toBe(false);
    });

    it("should return false when tags is missing", () => {
      const { tags, ...trackWithoutTags } = validTrack;
      expect(isTrack(trackWithoutTags)).toBe(false);
    });

    it("should return false when tags is not an array", () => {
      expect(isTrack({ ...validTrack, tags: "not an array" })).toBe(false);
    });

    it("should return false when tags contains non-string", () => {
      expect(isTrack({ ...validTrack, tags: ["valid", 123] })).toBe(false);
    });

    it("should return false when url is missing", () => {
      const { url, ...trackWithoutUrl } = validTrack;
      expect(isTrack(trackWithoutUrl)).toBe(false);
    });

    it("should return false when url is not a string", () => {
      expect(isTrack({ ...validTrack, url: 123 })).toBe(false);
    });

    it("should return false when title is missing", () => {
      const { title, ...trackWithoutTitle } = validTrack;
      expect(isTrack(trackWithoutTitle)).toBe(false);
    });

    it("should return false when title is not a string", () => {
      expect(isTrack({ ...validTrack, title: 123 })).toBe(false);
    });

    it("should return false when ts is missing", () => {
      const { ts, ...trackWithoutTs } = validTrack;
      expect(isTrack(trackWithoutTs)).toBe(false);
    });

    it("should return false when ts is not a number", () => {
      expect(isTrack({ ...validTrack, ts: "not a number" })).toBe(false);
    });

    it("should return false when ts is not an integer", () => {
      expect(isTrack({ ...validTrack, ts: 123.45 })).toBe(false);
    });

    it("should return true for empty tags array", () => {
      expect(isTrack({ ...validTrack, tags: [] })).toBe(true);
    });
  });

  describe("isTracksBatch", () => {
    const validTrack1: Track = {
      event: "page_view",
      tags: ["homepage"],
      url: "https://example.com",
      title: "Home Page",
      ts: 1234567890,
    };

    const validTrack2: Track = {
      event: "click",
      tags: ["button"],
      url: "https://example.com",
      title: "Home Page",
      ts: 1234567891,
    };

    it("should return true for valid tracks batch", () => {
      expect(isTracksBatch([validTrack1, validTrack2])).toBe(true);
    });

    it("should return true for single track", () => {
      expect(isTracksBatch([validTrack1])).toBe(true);
    });

    it("should return false for empty array", () => {
      expect(isTracksBatch([])).toBe(false);
    });

    it("should return false for null", () => {
      expect(isTracksBatch(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isTracksBatch(undefined)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isTracksBatch("not an array")).toBe(false);
    });

    it("should return false for object", () => {
      expect(isTracksBatch({})).toBe(false);
    });

    it("should return false when array contains invalid track", () => {
      expect(isTracksBatch([validTrack1, "invalid track"])).toBe(false);
    });

    it("should return false when array contains null", () => {
      expect(isTracksBatch([validTrack1, null])).toBe(false);
    });

    it("should return false when array contains undefined", () => {
      expect(isTracksBatch([validTrack1, undefined])).toBe(false);
    });
  });
});
