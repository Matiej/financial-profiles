export type InsightIntervention = {
  type: string;
  titlePl: string;
  whyPl: string;
  howPl: string;
};

export type CategoryInsight = {
  categoryId: string;
  categoryLabelPl: string;
  strengthsPl: string[];
  risksPl: string[];
  contradictionsPl: string[];
  recommendedInterventionsDto: InsightIntervention[];
};

export type DominantCategory = {
  categoryId: string;
  balanceIndex: number; // 0..1
  why: string;
};

export type ClientSummary = {
  keyThemes: string[];
  dominantCategories: DominantCategory[];
  overallNarrativePl: string;
};

export type InsightReport = {
  submissionId: string;
  clientId: string;
  clientName: string | null;
  testName: string;
  model: string;
  schemaName: string;
  schemaVersion: string;
  createdAt: string; // ISO
  insightReportStructuredAiResponseDto: {
    clientSummary: ClientSummary;
    categoryInsights: CategoryInsight[];
    nextSteps: string[];
  };
};

// GET /api/analysis/:submissionId  -> InsightReport[]
export async function fetchAnalyses(submissionId: string): Promise<InsightReport[]> {
  const res = await fetch(`/api/analysis/${encodeURIComponent(submissionId)}`);
  if (!res.ok) throw new Error("Błąd podczas pobierania analiz");
  return res.json();
}
