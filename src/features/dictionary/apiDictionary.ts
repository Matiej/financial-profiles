import { fetchJSON } from "../../lib/httpClient";
import type { StatementProfile, StatementDefinitionDto } from "../../types/profilerTypes";

export const PROFILE_PL: Record<StatementProfile, string> = {
  PROFIL_1: "Profil 1 – Strażniczka Braku",
  PROFIL_2: "Profil 2 – Samowystarczalna Tarcza",
  PROFIL_3: "Profil 3 – Zamrożona Wizjonerka",
  PROFIL_4: "Profil 4 – Lojalna Dziedziczka",
  PROFIL_5: "Profil 5 – Wycofana Liderka",
  PROFIL_6: "Profil 6 – Zapracowana Perfekcjonistka",
  PROFIL_7: "Profil 7 – Zatrzymana w Przyjmowaniu",
  PROFIL_8: "Profil 8 – Idealistka Skromności",
};

export const ALL_PROFILES = Object.keys(PROFILE_PL) as StatementProfile[];

// Obsługuje zarówno "Strażniczka Braku" (stara BE) jak i "PROFIL_1" (nowa BE)
export function formatProfileLabel(category: string): string {
  if (category in PROFILE_PL) {
    return PROFILE_PL[category as StatementProfile];
  }
  const entry = Object.entries(PROFILE_PL).find(
    ([, label]) => label.split(" – ")[1] === category
  );
  return entry ? entry[1] : category;
}

export const apiDictionary = {
  byCategory: (category: StatementProfile): Promise<StatementDefinitionDto[]> =>
    fetchJSON(`/definition?category=${encodeURIComponent(category)}`),

  all: async () => {
    const entries = await Promise.all(
      ALL_PROFILES.map(async (profile) => {
        const list = await fetchJSON<StatementDefinitionDto[]>(
          `/definition?category=${encodeURIComponent(profile)}`
        );
        return [profile, list] as const;
      })
    );
    return Object.fromEntries(entries) as Record<StatementProfile, StatementDefinitionDto[]>;
  },
};
