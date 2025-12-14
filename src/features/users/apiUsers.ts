import type { UserResponse, CreateUserPayload } from "../../types/userTypes";
import { fetchJSON } from "../../lib/httpClient";

export const apiUsers = {
    listUsers: (): Promise<UserResponse[]> => fetchJSON("/users"),

    createUser: (payload: CreateUserPayload): Promise<string> => fetchJSON("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    }),

    deleteUser: (userId: string): Promise<void> =>
        fetchJSON<void>(`/users/${encodeURIComponent(userId)}`, {
            method: "DELETE"
        }),
}