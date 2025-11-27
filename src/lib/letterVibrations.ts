export const LETTER_VIBRATION: Record<string, number> = {
  // 1
  A: 1, Ą: 1, J: 1, S: 1, Ś: 1,
  // 2
  B: 2, K: 2, T: 2,
  // 3
  C: 3, Ć: 3, L: 3, Ł: 3, U: 3,
  // 4
  D: 4, M: 4, V: 4,
  // 5
  E: 5, Ę: 5, N: 5, Ń: 5, W: 5,
  // 6
  F: 6, O: 6, Ó: 6, X: 6,
  // 7
  G: 7, P: 7, Y: 7,
  // 8
  H: 8, Q: 8, Z: 8, Ż: 8, Ź: 8,
  // 9
  I: 9, R: 9,
};

export const VOWELS = new Set<string>([
  "A", "Ą", "E", "Ę", "I", "O", "Ó", "U", "Y",
]);

export function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

export function getNumberForChar(ch: string): number | null {
  if (isDigit(ch)) return Number(ch); // cyfry 1:1
  const val = LETTER_VIBRATION[ch];
  return typeof val === "number" ? val : null;
}