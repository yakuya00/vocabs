const LANG_MAP: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
  cs: "cs-CZ",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  pl: "pl-PL",
  uk: "uk-UA",
  tr: "tr-TR",
};

// Кэш ссылок на сгенерированные mp3, чтобы не дергать API повторно для того же слова
const audioUrlCache = new Map<string, string>();

async function fetchSoundOfTextUrl(
  text: string,
  voice: string,
): Promise<string> {
  const cacheKey = `${voice}:${text.toLowerCase()}`;
  const cached = audioUrlCache.get(cacheKey);
  if (cached) return cached;

  const createRes = await fetch("https://api.soundoftext.com/sounds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      engine: "Google",
      data: { text, voice },
    }),
  });

  if (!createRes.ok) throw new Error("Failed to create sound request");
  const { id: soundId } = await createRes.json();
  if (!soundId) throw new Error("No sound ID returned");

  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const statusRes = await fetch(
      `https://api.soundoftext.com/sounds/${soundId}`,
    );
    if (!statusRes.ok) continue;

    const statusData = await statusRes.json();

    if (statusData.status === "Done" && statusData.location) {
      audioUrlCache.set(cacheKey, statusData.location);
      return statusData.location;
    }

    if (statusData.status === "Error") {
      throw new Error(statusData.message || "TTS conversion failed");
    }
  }

  throw new Error("TTS polling timed out");
}

export async function playTextToSpeech(
  text: string,
  sourceLang = "en",
): Promise<void> {
  const cleanText = text.trim();
  if (!cleanText) return;

  const langCode = sourceLang.toLowerCase();
  const targetLang = LANG_MAP[langCode] || "en-US";
  const hasSpeechApi =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // 1. Проверяем нативные голоса ОС
  if (hasSpeechApi) {
    const availableVoices = window.speechSynthesis.getVoices();
    const matchedVoice = availableVoices.find((v) => {
      const vLang = v.lang.toLowerCase().replace("_", "-");
      return (
        vLang === targetLang.toLowerCase() ||
        vLang.startsWith(langCode) ||
        v.name.toLowerCase().includes("czech") ||
        v.name.toLowerCase().includes("česk")
      );
    });

    if (matchedVoice) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return;
    }
  }

  // 2. Fallback через SoundOfText API
  try {
    const audioUrl = await fetchSoundOfTextUrl(cleanText, targetLang);
    const audio = new Audio(audioUrl);
    audio.playbackRate = 0.95;
    await audio.play();
  } catch (err) {
    console.error("Audio fallback failed:", err);

    // 3. Аварийный синтезатор браузера
    if (hasSpeechApi) {
      const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
      fallbackUtterance.lang = targetLang;
      window.speechSynthesis.speak(fallbackUtterance);
    }
  }
}
