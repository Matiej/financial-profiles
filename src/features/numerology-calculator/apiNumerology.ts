import { fetchJSON } from "../../lib/httpClient";
import type { NumerologyDatesResult, NumerologyPhraseResult } from "../../types/ncalculatorTypes";

export const apiNumerology = {
    calculatePhrase: (phrase: string): Promise<NumerologyPhraseResult> =>
        fetchJSON("/ncalculator/phrase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phrase }),
        }),

    calculateDates: (
        birthDate: string,
        referenceDate: string
    ): Promise<NumerologyDatesResult> =>
        fetchJSON("/ncalculator/dates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ birthDate, referenceDate }),
        }),
};