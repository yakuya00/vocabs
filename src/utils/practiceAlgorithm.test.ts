import { describe, test, expect } from "vitest";
import {
  getStagesForCard,
  calculateNextReview,
  insertWithSpacing,
} from "./practiceAlgorithm";

describe("practiceAlgorithm", () => {
  describe("getStagesForCard", () => {
    test("for box 0 and box 1 assign stages of choosing (ru_to_en) or typing (typing)", () => {
      expect(getStagesForCard(0)).toEqual(["ru_to_en", "typing"]);
      expect(getStagesForCard(1)).toEqual(["ru_to_en", "typing"]);
    });
    test("for box 2 and box 3 assign stages of choosing (en_to_ru) or typing (typing)", () => {
      expect(getStagesForCard(2)).toEqual(["en_to_ru", "typing"]);
      expect(getStagesForCard(3)).toEqual(["en_to_ru", "typing"]);
    });
    test("for box 4 and more assign stage of typing (typing)", () => {
      expect(getStagesForCard(4)).toEqual(["typing"]);
      expect(getStagesForCard(5)).toEqual(["typing"]);
    });
  });

  describe("calculateNextRewiew", () => {
    const fixedNow = new Date("2026-03-01T12:00:00Z");
    test("with success answer increase Box by 1 and set an interval in days", () => {
      const result = calculateNextReview(1, false, fixedNow);
      expect(result.nextBox).toEqual(2);

      const nextDate = new Date(result.nextReviewAt);
      expect(nextDate.getDate()).toBe(4);
    });

    test("don't rise Box above 5", () => {
      const result = calculateNextReview(5, false, fixedNow);
      expect(result.nextBox).toBe(5);
    });

    test("with fail (hasFailed: true) always throw card to Box 1", () => {
      const result = calculateNextReview(4, true, fixedNow);
      expect(result.nextBox).toBe(1);

      const nextDate = new Date(result.nextReviewAt);
      expect(nextDate.getDate()).toBe(2);
    });
  });

  describe("insertWithSpacing (интерливинг)", () => {
    test("вставляет элемент со сдвигом 3 в длинную очередь", () => {
      const queue = ["A", "B", "C", "D", "E"];
      const updated = insertWithSpacing(queue, "X", 3);

      expect(updated).toEqual(["A", "B", "C", "X", "D", "E"]);
    });

    test("если очередь короче сдвига, безопасно вставляет в конец очереди", () => {
      const shortQueue = ["A", "B"];
      const updated = insertWithSpacing(shortQueue, "X", 3);

      expect(updated).toEqual(["A", "B", "X"]);
    });

    test("работает с пустой очередью", () => {
      const emptyQueue: string[] = [];
      const updated = insertWithSpacing(emptyQueue, "X", 3);

      expect(updated).toEqual(["X"]);
    });
  });
});
