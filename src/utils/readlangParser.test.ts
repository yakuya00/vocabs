import { describe, test, expect } from "vitest";
import { parseReadlangFile } from "./readlangParser";

describe("readlangParser", () => {
  test("корректно парсит строку с контекстом и заменяет перевод на пропуск ______", () => {
    const raw = "Mám rád [[jablka]] k snídani.\tapples\n";
    const result = parseReadlangFile(raw);

    expect(result).toHaveLength(1);
    expect(result[0].word).toBe("apples");
    expect(result[0].translation).toBe("jablka");
    expect(result[0].context).toBe("Mám rád ______ k snídani.");
  });

  test("корректно парсит слово без окружающего контекста", () => {
    const raw = "[[kočka]]\tcat";
    const result = parseReadlangFile(raw);

    expect(result).toHaveLength(1);
    expect(result[0].word).toBe("cat");
    expect(result[0].translation).toBe("kočka");
    expect(result[0].context).toBe("");
  });

  test("игнорирует пустые строки и мусорные переносы", () => {
    const raw = `
      Mám rád [[čaj]].\ttea


      [[pes]]\tdog
    `;
    const result = parseReadlangFile(raw);

    expect(result).toHaveLength(2);
  });
});
