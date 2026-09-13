import { describe, it, expect } from "vitest";
import { ayahsAudioUrls } from "./audio";

describe("ayahsAudioUrls", () => {
  it("builds a single-ayah URL with zero padding", () => {
    expect(ayahsAudioUrls(1, 1)).toEqual(["https://everyayah.com/data/Alafasy_128kbps/001001.mp3"]);
  });
  it("builds a range of ayah URLs", () => {
    expect(ayahsAudioUrls(96, 1, 5)).toEqual([
      "https://everyayah.com/data/Alafasy_128kbps/096001.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096002.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096003.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096004.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096005.mp3",
    ]);
  });
  it("honors a custom reciter", () => {
    expect(ayahsAudioUrls(1, 1, 1, "Husary_128kbps")[0]).toContain("Husary_128kbps");
  });
});
