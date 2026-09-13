import { describe, it, expect } from "vitest";
import { relatedEntries } from "./related";

const entries = [
  { id: "a", data: { relatedEvents: ["perang-badar", "perang-uhud"] } },
  { id: "b", data: { relatedEvents: ["perang-uhud"] } },
  { id: "c", data: {} },
];

describe("relatedEntries", () => {
  it("finds entries referencing a given event slug", () => {
    expect(relatedEntries(entries, "perang-uhud").map((e) => e.id)).toEqual(["a", "b"]);
  });
  it("returns empty when no entry references the slug", () => {
    expect(relatedEntries(entries, "isra-miraj")).toEqual([]);
  });
});
