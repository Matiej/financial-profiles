// Shared
export type StatementType = "LIMITING" | "SUPPORTING";

// Profiler – list
export type SubmissionListItem = {
  clientName: string;
  clientId: string;
  submissionId: string;
  submissionDate: string; // ISO
  testName: string;
  isAnalyzed: boolean;
};

// Profiler – details
export type ProfiledStatement = {
  description: string;
  type: StatementType;
  status: boolean;
};
export type ProfileCategory = {
  categoryName: string;
  description: string;
};
export type ProfiledCategory = {
  category: ProfileCategory;
  totalLimiting: number;
  totalSupporting: number;
  profiledStatementList: ProfiledStatement[];
};
export type ProfiledSubmission = {
  clientName: string;
  clientId: string;
  submissionId: string;
  submissionDate: string; // ISO
  testName: string;
  profiledCategoryClientStatementsList: ProfiledCategory[];
};

// Dictionary
export type StatementCategory =
  | "SCARCITY_GUARDIAN"
  | "SELF_SUFFICIENT_SHIELD"
  | "FROZEN_VISIONARY"
  | "LOYAL_HEIRESS"
  | "WITHDRAWN_LEADER"
  | "OVERWORKED_PERFECTIONIST"
  | "BLOCKED_IN_RECEIVING"
  | "MODESTY_IDEALIST";

export interface StatementTypeDefinition {
  key: string;
  statementType: StatementType;
  statementDescription: string;
}
export interface StatementDefinitionDto {
  statementId: string;
  category: StatementCategory;
  statementKey: string;
  statementTypeDefinitions: StatementTypeDefinition[];
}

// Analyses
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
  payloadMode: PayloadMode | null
  schemaVersion: string;
  createdAt: string; // ISO
  insightReportStructuredAiResponseDto: {
    clientSummary: ClientSummary;
    categoryInsights: CategoryInsight[];
    nextSteps: string[];
  };
};
export type PayloadMode = "MINIMAL" | "ENRICHED" | "FULL";

export type LatestStatus =
  | {
    submissionId: string;
    status: string;
    mode: PayloadMode;
    error: string | null;
    createdAt: string;
    updatedAt: string;
    expireAt: string | null;
    isLocked: boolean;
    remainingLockSeconds: number | null;
  }
  | null; // 204 noContent

export type ScoreBucketKey = "-2" | "-1" | "0" | "1" | "2";
export type ScoreBuckets = Partial<Record<ScoreBucketKey, number>>;

// Short row do listy scoringowych testów
export type ScoringProfiledShort = {
  testSubmissionPublicId: string;
  clientName: string;
  clientId: string;
  clientTestDate: string;    // Instant -> ISO
  submissionId: string;
  submissionDate: string;    // Instant -> ISO
  testName: string;
  totalScoring: number;
  numberOfStatements: number;
};

// Top summary
export type ScoringOverallSummary = {
  totalAnswers: number;
  totalScore: number;
  scoreBuckets: ScoreBuckets;
};

export type ScoringStatementPair = {
  statementKey: string;
  limitingDescription: string;
  supportingDescription: string;
  scoring: number; // -2..2
};

export type ScoringCategoryBlock = {
  category: ProfileCategory;  
  totalAnswers: number;
  totalScore: number;
  avgScore: number;
  scoreBuckets: ScoreBuckets;
  answersBySeverity: ScoringStatementPair[];
};

export type ScoringProfiledSubmission = {
  testSubmissionPublicId: string;
  clientName: string;
  clientId: string;
  submissionId: string;
  submissionDate: string; // ISO
  testId: string;
  testName: string;
  clientTestDate: string; 
  overallSummary: ScoringOverallSummary;
  categories: ScoringCategoryBlock[];
};