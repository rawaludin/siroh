export const DEFAULT_RECITER = "Alafasy_128kbps";

const pad = (n: number) => String(n).padStart(3, "0");

export function ayahsAudioUrls(
  surah: number,
  ayah: number,
  ayahEnd?: number,
  reciter: string = DEFAULT_RECITER,
): string[] {
  if (surah <= 0 || ayah <= 0) return [];
  if (ayahEnd !== undefined && ayahEnd < ayah) return [];
  const end = ayahEnd ?? ayah;
  const urls: string[] = [];
  for (let a = ayah; a <= end; a++) {
    urls.push(`https://everyayah.com/data/${reciter}/${pad(surah)}${pad(a)}.mp3`);
  }
  return urls;
}
