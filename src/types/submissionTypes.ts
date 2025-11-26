export type SubmissionStatus = "OPEN" | "DONE";

export interface Submission {
  submissionId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  orderId: string;
  testId: string;
  status: SubmissionStatus;
  remainingSeconds: number;   //backend count it
  publicToken: string;
  createdAt: string;          // ISO z backendu (Instant)
}

export interface SubmissionCreatePayload {
  clientId: string;    // tmp "fe_test_id"
  clientName: string;
  clientEmail: string;
  orderId: string;
  testId: string;
  durationDays: number; 
}

export interface SubmissionUpdatePayload {
  clientName: string;
  clientEmail: string;
  testId: string;
  durationDays: number;
}