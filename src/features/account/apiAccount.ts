import type { AccountResponse, UpdateProfilePayload } from "../../types/accountTypes";
import { fetchJSON } from "../../lib/httpClient";

export const apiAccount = {
  getAccount: (): Promise<AccountResponse> => fetchJSON("/account"),

  updateProfile: (payload: UpdateProfilePayload): Promise<AccountResponse> =>
    fetchJSON("/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  requestPasswordReset: (): Promise<void> =>
    fetchJSON<void>("/account/reset-password", {
      method: "POST",
    }),

  deleteAccount: (): Promise<void> =>
    fetchJSON<void>("/account", {
      method: "DELETE",
    }),
};
