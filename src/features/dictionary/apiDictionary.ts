import { fetchJSON } from "../../lib/httpClient";
import type { StatementCategory, StatementDefinitionDto } from "../../types/profilerTypes";

// mapowanie EN->PL (jak u Ciebie)
export const CATEGORY_PL: Record<StatementCategory, string> = {
  SCARCITY_GUARDIAN: "Strażniczka Braku",
  SELF_SUFFICIENT_SHIELD: "Samowystarczalna Tarcza",
  FROZEN_VISIONARY: "Zamrożona Wizjonerka",
  LOYAL_HEIRESS: "Lojalna Dziedziczka",
  WITHDRAWN_LEADER: "Wycofana Liderka",
  OVERWORKED_PERFECTIONIST: "Zapracowana Perfekcjonistka",
  BLOCKED_IN_RECEIVING: "Zatrzymana w Przyjmowaniu",
  MODESTY_IDEALIST: "Idealistka Skromności",
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_PL) as StatementCategory[];

export const apiDictionary = {
  byCategory: (category: StatementCategory): Promise<StatementDefinitionDto[]> =>
    fetchJSON(`/definition/category?category=${encodeURIComponent(category)}`),

  all: async () => {
    const entries = await Promise.all(
      ALL_CATEGORIES.map(async (cat) => {
        const list = await fetchJSON<StatementDefinitionDto[]>(
          `/definition/category?category=${encodeURIComponent(cat)}`
        );
        return [cat, list] as const;
      })
    );
    return Object.fromEntries(entries) as Record<StatementCategory, StatementDefinitionDto[]>;
  },
};
