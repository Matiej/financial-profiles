export interface FpTestStatement {
  statementKey: string;
  statementsDescription: string;
  statementsCategory: string;
}

export interface FpTest {
  testId: string;
  testName: string;
  descriptionBefore: string | null;
  descriptionAfter: string | null;
  fpTestStatementDtoList: FpTestStatement[];
  createdAt: string | null;   // ISO
  updatedAt: string | null;   // ISO
}

// payload do CREATE
export interface FpTestCreatePayload {
  testName: string;
  descriptionBefore: string;
  descriptionAfter: string;
  statementKeys: string[];    // <- list of statementKeys
}

// payload do UPDATE
export interface FpTestUpdatePayload {
  testId: string;
  testName: string;
  descriptionBefore: string;
  descriptionAfter: string;
  statementKeys: string[];
}