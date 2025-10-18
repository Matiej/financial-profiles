// === LISTA: GET /api/profiler ===
export type SubmissionListItem = {
  clientName: string;
  clientId: string;
  submissionId: string;
  submissionDate: string; // Instant → serializuje się jako ISO string
  testName: string;
  isAnalyzed: boolean;
};

// === DETALE: GET /api/profiler/{submissionId} ===
export type StatementType = "LIMITING" | "SUPPORTING";

export type ProfiledStatement = {
  description: string;
  type: StatementType;     // z enumu StatementType w Javie
  status: boolean;         // Boolean w Javie
};

export type ProfileCategory = {
  categoryName: string;    // np. "WITHDRAWN_LEADER"
  description: string;     // np. "Wycofana Liderka"
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
  submissionDate: string; // Instant → ISO
  testName: string;
  profiledCategoryClientStatementsList: ProfiledCategory[];
};
