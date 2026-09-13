export type EraId = "jahiliyyah" | "mecca" | "medina" | "post-fath";

export interface Era {
  id: EraId;
  label: string;
  labelAr: string;
  description: string;
  color: string;
}

export const ERAS: Era[] = [
  {
    id: "jahiliyyah",
    label: "Masa Jahiliyyah",
    labelAr: "الجاهلية",
    description: "Keadaan bangsa Arab sebelum Islam hingga menjelang diutusnya Nabi.",
    color: "#8a6d3b",
  },
  {
    id: "mecca",
    label: "Periode Makkah",
    labelAr: "العهد المكي",
    description: "Dari wahyu pertama hingga hijrah ke Madinah.",
    color: "#1f6f8b",
  },
  {
    id: "medina",
    label: "Periode Madinah",
    labelAr: "العهد المدني",
    description: "Dari hijrah hingga pembebasan Makkah.",
    color: "#2d8a4e",
  },
  {
    id: "post-fath",
    label: "Pasca Fathu Makkah",
    labelAr: "بعد فتح مكة",
    description: "Dari pembebasan Makkah hingga wafatnya Nabi.",
    color: "#8b1f2d",
  },
];

export const ERA_IDS = ERAS.map((e) => e.id);

const byId = new Map(ERAS.map((e) => [e.id, e]));

export function getEra(id: EraId): Era {
  const era = byId.get(id);
  if (!era) throw new Error(`Unknown era: ${id}`);
  return era;
}
