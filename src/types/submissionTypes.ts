export type SubmissionStatus = "OPEN" | "DONE";

export interface Submission {
  submissionId: string;
  clientId: string;
  clientName: string;
  testName: string;
  status: SubmissionStatus;
  remainingSeconds: number;   //backend count it
  publicToken: string;
  createdAt: string;          // ISO z backendu (Instant)
}

export interface SubmissionCreatePayload {
  clientId: string;    // tmp "fe_test_id"
  clientName: string;
  testName: string;
  durationMin: number; 
}

export interface SubmissionUpdatePayload {
  clientName: string;
  testName: string;
  durationMin: number;
}