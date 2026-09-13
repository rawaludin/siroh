export const POINTS_PER_READ = 10;

export interface LevelTier {
  min: number;
  name: string;
  icon: string;
}

export const LEVELS: LevelTier[] = [
  { min: 0, name: "Musafir Kecil", icon: "🧭" },
  { min: 50, name: "Penjelajah Sirah", icon: "🗺️" },
  { min: 120, name: "Sahabat Nabi", icon: "🤝" },
  { min: 200, name: "Penjaga Wahyu", icon: "📜" },
  { min: 300, name: "Pahlawan Badar", icon: "⚔️" },
  { min: 420, name: "Bintang Madinah", icon: "🌟" },
];

export interface PlayerState {
  points: number;
  readIds: string[];
  lastVisit: string;
  streak: number;
}

export function initialState(): PlayerState {
  return { points: 0, readIds: [], lastVisit: "", streak: 0 };
}

export interface LevelInfo {
  level: number;
  name: string;
  icon: string;
  min: number;
  nextMin: number | null;
  progress: number;
}

export function computeLevel(points: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  let progress = 1;
  if (next) {
    const span = next.min - current.min;
    progress = span > 0 ? Math.min(1, (points - current.min) / span) : 1;
  }
  return {
    level: index + 1,
    name: current.name,
    icon: current.icon,
    min: current.min,
    nextMin: next ? next.min : null,
    progress,
  };
}

export function awardRead(state: PlayerState, id: string): PlayerState {
  if (state.readIds.includes(id)) return state;
  return {
    ...state,
    points: state.points + POINTS_PER_READ,
    readIds: [...state.readIds, id],
  };
}

export interface Progress {
  read: number;
  total: number;
  percent: number;
}

export function computeProgress(state: PlayerState, total: number): Progress {
  const read = state.readIds.length;
  const percent = total > 0 ? Math.round((read / total) * 100) : 0;
  return { read, total, percent };
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const BADGES: Badge[] = [
  { id: "first-read", name: "Langkah Pertama", desc: "Membaca peristiwa pertama.", icon: "👣" },
  { id: "era-jahiliyyah", name: "Jahiliyyah", desc: "Menyelesaikan era Jahiliyyah.", icon: "🏜️" },
  { id: "era-mecca", name: "Periode Makkah", desc: "Menyelesaikan era Makkah.", icon: "🕋" },
  { id: "era-medina", name: "Periode Madinah", desc: "Menyelesaikan era Madinah.", icon: "🕌" },
  { id: "era-post-fath", name: "Pasca Fathu Makkah", desc: "Menyelesaikan era pasca Fathu Makkah.", icon: "🕊️" },
  { id: "streak-3", name: "Tiga Hari", desc: "Membaca 3 hari berturut-turut.", icon: "🔥" },
  { id: "streak-7", name: "Seminggu Penuh", desc: "Membaca 7 hari berturut-turut.", icon: "⭐" },
  { id: "all-read", name: "Sang Penghafal", desc: "Membaca seluruh peristiwa.", icon: "🏆" },
];

export interface EventMeta {
  id: string;
  era: string;
}

export function computeBadges(state: PlayerState, events: EventMeta[]): Badge[] {
  const earned: Badge[] = [];
  const read = new Set(state.readIds);

  if (read.size > 0) {
    earned.push(BADGES.find((b) => b.id === "first-read")!);
  }

  const eras = ["jahiliyyah", "mecca", "medina", "post-fath"];
  for (const era of eras) {
    const eraIds = events.filter((e) => e.era === era).map((e) => e.id);
    if (eraIds.length > 0 && eraIds.every((id) => read.has(id))) {
      const badge = BADGES.find((b) => b.id === `era-${era}`);
      if (badge) earned.push(badge);
    }
  }

  if (state.streak >= 3) {
    earned.push(BADGES.find((b) => b.id === "streak-3")!);
  }
  if (state.streak >= 7) {
    earned.push(BADGES.find((b) => b.id === "streak-7")!);
  }

  if (events.length > 0 && events.every((e) => read.has(e.id))) {
    earned.push(BADGES.find((b) => b.id === "all-read")!);
  }

  return earned;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function updateStreak(state: PlayerState, today: string): PlayerState {
  if (state.lastVisit === today) return state;

  const prev = state.lastVisit === "" ? null : Date.parse(state.lastVisit);
  const now = Date.parse(today);
  const isConsecutive =
    prev !== null && now - prev === DAY_MS;

  const streak = isConsecutive ? state.streak + 1 : 1;

  return { ...state, lastVisit: today, streak };
}
