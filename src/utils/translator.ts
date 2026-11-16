const fetchWithTimeout = async (url: string, timeoutMs = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch {
    clearTimeout(id);
    return null;
  }
};

export async function fetchWordData(
  rawWord: string,
  sourceLang = "en",
  targetLang = "ru",
) {
  const cleanWord = rawWord.trim().toLowerCase();
  if (!cleanWord) return null;

  const isSingleWord = !cleanWord.includes(" ");

  try {
    // 1. Google Translate
    const translatePromise = fetchWithTimeout(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanWord)}`,
    ).then((r) => (r && r.ok ? r.json() : null));

    // 2. Free Dictionary API (только для одиночных слов)
    const dictPromise = isSingleWord
      ? fetchWithTimeout(
          `https://freedictionaryapi.com/api/v1/entries/${sourceLang}/${encodeURIComponent(cleanWord)}`,
        )
          .then((r) => (r && r.ok ? r.json() : null))
          .catch(() => null)
      : Promise.resolve(null);

    const [gtRes, dictRes] = await Promise.allSettled([
      translatePromise,
      dictPromise,
    ]);

    let translation = "";
    if (
      gtRes.status === "fulfilled" &&
      gtRes.value &&
      gtRes.value[0]?.[0]?.[0]
    ) {
      translation = gtRes.value[0].map((item: any) => item[0]).join("");
    }

    let context = "";
    if (
      dictRes.status === "fulfilled" &&
      dictRes.value &&
      dictRes.value.entries?.[0]?.senses?.[0]?.examples?.[0]
    ) {
      const example = dictRes.value.entries[0].senses[0].examples[0];
      const reg = new RegExp(`\\b${cleanWord}\\b`, "gi");
      context = example.replace(reg, "______");
    }

    return {
      word: cleanWord,
      translation,
      context,
    };
  } catch (e) {
    console.error("Auto-translation error:", e);
    return null;
  }
}
