export function processVerbatimTranscript(rawText) {
  if (typeof rawText !== "string") return "";
  return rawText.trim();
}
