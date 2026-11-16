export interface ParsedCard {
  word: string;
  translation: string;
  context: string;
}

export function parseReadlangFile(rawText: string): ParsedCard[] {
  const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const result: ParsedCard[] = [];

  for (const line of lines) {
    const parts = line.split("\t").map((p) => p.trim());
    if (parts.length < 2) continue;

    const leftPart = parts[0];
    const englishWord = parts[1];
    if (!englishWord) continue;

    const bracketMatch = leftPart.match(/\[\[(.*?)\]\]/);
    let translation = "";
    let context = "";

    if (bracketMatch) {
      translation = bracketMatch[1].trim();
      const contextWithBlank = leftPart.replace(/\[\[.*?\]\]/, "______").trim();
      if (contextWithBlank !== "______") {
        context = contextWithBlank;
      }
    } else {
      context = leftPart;
    }

    result.push({
      word: englishWord,
      translation,
      context,
    });
  }

  return result;
}
