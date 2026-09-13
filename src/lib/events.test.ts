import { describe, it, expect } from "vitest";
import { matchesFilter, filterEvents, sortChronological, groupByEra } from "./events";

const a = { era: "mecca" as const, themes: ["wahyu"], searchText: "wahyu pertama gua hira", order: 2 };
const b = { era: "medina" as const, themes: ["perang"], searchText: "perang badar", order: 3 };
const c = { era: "mecca" as const, themes: ["hijrah", "perang"], searchText: "hijrah ke habasyah", order: 1 };

describe("matchesFilter", () => {
  it("matches everything with no filters", () => {
    expect(matchesFilter(a, { query: "", eras: [], themes: [] })).toBe(true);
  });

  it("matches era by OR within era dimension", () => {
    expect(matchesFilter(a, { query: "", eras: ["mecca", "medina"], themes: [] })).toBe(true);
    expect(matchesFilter(a, { query: "", eras: ["medina"], themes: [] })).toBe(false);
  });

  it("matches themes by OR within theme dimension", () => {
    expect(matchesFilter(c, { query: "", eras: [], themes: ["perang", "keluarga"] })).toBe(true);
    expect(matchesFilter(a, { query: "", eras: [], themes: ["perang"] })).toBe(false);
  });

  it("ANDs across era and theme dimensions", () => {
    expect(matchesFilter(b, { query: "", eras: ["medina"], themes: ["perang"] })).toBe(true);
    expect(matchesFilter(b, { query: "", eras: ["mecca"], themes: ["perang"] })).toBe(false);
  });

  it("matches query as case-insensitive substring", () => {
    expect(matchesFilter(a, { query: "HIRA", eras: [], themes: [] })).toBe(true);
    expect(matchesFilter(a, { query: "badar", eras: [], themes: [] })).toBe(false);
  });
});

describe("sortChronological", () => {
  it("sorts ascending by order", () => {
    expect(sortChronological([a, b, c]).map((e) => e.order)).toEqual([1, 2, 3]);
  });
});

describe("groupByEra", () => {
  it("groups sorted events by era in ERA_IDS order", () => {
    const groups = groupByEra([a, b, c]);
    expect(groups.map((g) => g.era.id)).toEqual(["mecca", "medina"]);
    expect(groups[0].items.map((e) => e.order)).toEqual([1, 2]);
  });

  it("orders groups by ERA_IDS regardless of event order", () => {
    const medinaFirst = { era: "medina" as const, themes: ["perang"], searchText: "perang badar", order: 1 };
    const meccaLater = { era: "mecca" as const, themes: ["wahyu"], searchText: "wahyu pertama gua hira", order: 2 };
    const groups = groupByEra([medinaFirst, meccaLater]);
    expect(groups.map((g) => g.era.id)).toEqual(["mecca", "medina"]);
    expect(groups[0].items.map((e) => e.order)).toEqual([2]);
    expect(groups[1].items.map((e) => e.order)).toEqual([1]);
  });
});

describe("filterEvents", () => {
  it("returns only matching items", () => {
    const out = filterEvents([a, b, c], { query: "", eras: [], themes: ["perang"] });
    expect(out.map((e) => e.searchText)).toEqual(["perang badar", "hijrah ke habasyah"]);
  });
});
