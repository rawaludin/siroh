import { describe, it, expect } from "vitest";
import { computeLevel, awardRead, computeProgress, computeBadges, updateStreak, initialState, POINTS_PER_READ } from "./gamification";

const events = [
  { id: "a", era: "jahiliyyah" }, { id: "b", era: "jahiliyyah" },
  { id: "c", era: "mecca" }, { id: "d", era: "medina" }, { id: "e", era: "post-fath" },
];

describe("computeLevel", () => {
  it("returns level 1 at 0 points", () => {
    const l = computeLevel(0);
    expect(l.level).toBe(1);
    expect(l.name).toBe("Musafir Kecil");
  });
  it("returns a higher level past a threshold", () => {
    expect(computeLevel(60).level).toBe(2);
  });
  it("caps at max level with progress 1", () => {
    const l = computeLevel(500);
    expect(l.nextMin).toBeNull();
    expect(l.progress).toBe(1);
  });
});

describe("awardRead", () => {
  it("awards points once per event", () => {
    const s0 = initialState();
    const s1 = awardRead(s0, "a");
    expect(s1.points).toBe(POINTS_PER_READ);
    expect(s1.readIds).toEqual(["a"]);
    expect(awardRead(s1, "a")).toBe(s1);
  });
});

describe("computeProgress", () => {
  it("computes percent", () => {
    const s = { ...initialState(), readIds: ["a", "b"] };
    expect(computeProgress(s, 4)).toEqual({ read: 2, total: 4, percent: 50 });
  });
});

describe("computeBadges", () => {
  it("earns first-read and era badges", () => {
    const s = { ...initialState(), readIds: ["a", "b"] };
    const ids = computeBadges(s, events).map((b) => b.id);
    expect(ids).toContain("first-read");
    expect(ids).toContain("era-jahiliyyah");
    expect(ids).not.toContain("all-read");
  });
  it("earns all-read when every event is read", () => {
    const s = { ...initialState(), readIds: events.map((e) => e.id) };
    expect(computeBadges(s, events).map((b) => b.id)).toContain("all-read");
  });
});

describe("updateStreak", () => {
  it("starts streak at 1 on first visit", () => {
    expect(updateStreak(initialState(), "2026-09-13").streak).toBe(1);
  });
  it("increments on consecutive days", () => {
    const s1 = updateStreak(initialState(), "2026-09-12");
    expect(updateStreak(s1, "2026-09-13").streak).toBe(2);
  });
  it("resets after a gap", () => {
    const s1 = updateStreak(initialState(), "2026-09-10");
    expect(updateStreak(s1, "2026-09-13").streak).toBe(1);
  });
});
