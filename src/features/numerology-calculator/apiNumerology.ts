import { fetchJSON } from "../../lib/httpClient";
import type { NumerologyPhraseResult } from "../../types/ncalculatorTypes";

export const apiNumerology = {
    calculatePhrase: (phrase: string): Promise<NumerologyPhraseResult> =>
        fetchJSON("/ncalculator/phrase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phrase }),
        }),
};