import { describe, it, expect } from "vitest";
import { ERAS, ERA_IDS, getEra } from "./eras";

describe("eras", () => {
  it("lists four eras in chronological order", () => {
    expect(ERA_IDS).toEqual(["jahiliyyah", "mecca", "medina", "post-fath"]);
  });

  it("exposes a getEra lookup", () => {
    const era = getEra("mecca");
    expect(era.id).toBe("mecca");
    expect(era.label).toBeTruthy();
    expect(era.color).toMatch(/^#/);
  });
});
