export function fmtDate(iso?: string, locale = "pl-PL") {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" })
      .format(new Date(iso));
  } catch {
    return iso ?? "—";
  }
}
