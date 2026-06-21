// Shared
export type StatementType = "LIMITING" | "SUPPORTING";

// Dictionary
export type StatementProfile =
  | "PROFIL_1"
  | "PROFIL_2"
  | "PROFIL_3"
  | "PROFIL_4"
  | "PROFIL_5"
  | "PROFIL_6"
  | "PROFIL_7"
  | "PROFIL_8";

export interface StatementTypeDefinition {
  statementType: StatementType;
  statementDescription: string;
}
export interface StatementDefinitionDto {
  statementId: string;
  category: StatementProfile;
  statementKey: string;
  statementTypeDefinitions: StatementTypeDefinition[];
}

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
  profileId: StatementProfile;
  profileName: string;
  computedLabel: string;
  scorePercent: number;
  totalAnswers: number;
  totalScore: number;
  avgScore: number;
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
  profiles: ScoringCategoryBlock[];
};