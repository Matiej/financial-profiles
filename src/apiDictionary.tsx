// API do słownika stwierdzeń (po kategoriach)
export type StatementType = "LIMITING" | "SUPPORTING";

export interface StatementTypeDefinition {
  key: string;
  statementType: StatementType;
  statementDescription: string;
}

export type StatementCategory =
  | "SCARCITY_GUARDIAN"
  | "SELF_SUFFICIENT_SHIELD"
  | "FROZEN_VISIONARY"
  | "LOYAL_HEIRESS"
  | "WITHDRAWN_LEADER"
  | "OVERWORKED_PERFECTIONIST"
  | "BLOCKED_IN_RECEIVING"
  | "MODESTY_IDEALIST";

export interface StatementDefinitionDto {
  statementId: string;
  category: StatementCategory;
  statementKey: string;
  statementTypeDefinitions: StatementTypeDefinition[]; // para LIMITING/SUPPORTING
}

// mapowanie EN->PL (z Twojego backendu)
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

export const ALL_CATEGORIES: StatementCategory[] = Object.keys(CATEGORY_PL) as StatementCategory[];

// bazowy prefiks API – trzymamy względnie, bo masz proxy /api -> backend
const DEF_BASE = "/api/definition";

export async function fetchStatementsByCategory(category: StatementCategory): Promise<StatementDefinitionDto[]> {
  const url = `${DEF_BASE}/category?category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${category}`);
  return res.json();
}

export async function fetchAllCategories() {
  const entries = await Promise.all(
    ALL_CATEGORIES.map(async (cat) => {
      const list = await fetchStatementsByCategory(cat);
      return [cat, list] as const;
    })
  );
  return Object.fromEntries(entries) as Record<StatementCategory, StatementDefinitionDto[]>;
}
