import { getEra, ERA_IDS, type Era, type EraId } from "./eras";
import type { CollectionEntry } from "astro:content";

export interface Filters {
  query: string;
  eras: EraId[];
  themes: string[];
}

export interface Filterable {
  era: EraId;
  themes: string[];
  searchText: string;
}

export interface Source {
  title: string;
  author: string;
  reference: string;
  link?: string;
}

export interface EventData {
  id: string;
  order: number;
  year: string;
  era: EraId;
  title: string;
  titleAr: string;
  summary: string;
  location?: string;
  themes: string[];
  sources: Source[];
  related?: string[];
  searchText: string;
}

type EventEntry = CollectionEntry<"events">;

export function toEventData(entry: EventEntry): EventData {
  return {
    id: entry.id,
    order: entry.data.order,
    year: entry.data.year,
    era: entry.data.era,
    title: entry.data.title,
    titleAr: entry.data.titleAr,
    summary: entry.data.summary,
    location: entry.data.location,
    themes: entry.data.themes,
    sources: entry.data.sources,
    related: entry.data.related,
    searchText: [entry.data.title, entry.data.titleAr, entry.data.summary, entry.body ?? ""]
      .join(" ")
      .toLowerCase(),
  };
}

export function matchesFilter(item: Filterable, f: Filters): boolean {
  if (f.eras.length > 0 && !f.eras.includes(item.era)) return false;
  if (f.themes.length > 0 && !f.themes.some((t) => item.themes.includes(t))) return false;
  const q = f.query.trim().toLowerCase();
  if (q && !item.searchText.toLowerCase().includes(q)) return false;
  return true;
}

export function filterEvents<T extends Filterable>(items: T[], f: Filters): T[] {
  return items.filter((item) => matchesFilter(item, f));
}

export function sortChronological<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((x, y) => x.order - y.order);
}

export function groupByEra<T extends Filterable & { order: number }>(
  items: T[],
): { era: Era; items: T[] }[] {
  const sorted = sortChronological(items);
  const result: { era: Era; items: T[] }[] = [];
  for (const item of sorted) {
    const era = getEra(item.era);
    let group = result.find((g) => g.era.id === era.id);
    if (!group) {
      group = { era, items: [] };
      result.push(group);
    }
    group.items.push(item);
  }
  return result.sort((a, b) => ERA_IDS.indexOf(a.era.id) - ERA_IDS.indexOf(b.era.id));
}
