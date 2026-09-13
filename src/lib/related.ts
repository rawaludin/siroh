export interface HasRelatedEvents {
  data: { relatedEvents?: string[] };
}

export function relatedEntries<T extends HasRelatedEvents>(
  entries: T[],
  eventSlug: string,
): T[] {
  return entries.filter((e) => (e.data.relatedEvents ?? []).includes(eventSlug));
}
