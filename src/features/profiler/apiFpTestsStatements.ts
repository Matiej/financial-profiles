import { fetchJSON } from "../../lib/httpClient";
import type { FpTest, FpTestStatement } from "../../types/fpTestTypes";

export const apiFpTestsStatements = {
  // GET /api/pftest
  list: (): Promise<FpTest[]> => fetchJSON("/pftest"),

  // GET /api/pftest/statements
  listStatements: (): Promise<FpTestStatement[]> =>
    fetchJSON("/pftest/statemets"),
};