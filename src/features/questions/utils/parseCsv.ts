import { emptySlot, type QuestionSlot } from "../hooks/useQuestionSlots";
import type { CorrectOption } from "../types";

const CORRECT_OPTION_MAP: Record<string, CorrectOption> = {
  "1": "option1",
  "2": "option2",
  "3": "option3",
  "4": "option4",
  option1: "option1",
  option2: "option2",
  option3: "option3",
  option4: "option4",
};

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseQuestionsCsv(text: string): QuestionSlot[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1);

  return rows.map((line) => {
    const cells = splitCsvLine(line);
    const record: Record<string, string> = {};
    header.forEach((key, i) => {
      record[key] = cells[i] ?? "";
    });

    const slot: QuestionSlot = {
      ...emptySlot(),
      question: record.question ?? "",
      option1: record.option1 ?? "",
      option2: record.option2 ?? "",
      option3: record.option3 ?? "",
      option4: record.option4 ?? "",
      correct_option: CORRECT_OPTION_MAP[(record.correct_option ?? "").toLowerCase()] ?? "option1",
      explanation: record.explanation ?? "",
      difficulty:
        record.difficulty === "easy" || record.difficulty === "medium" || record.difficulty === "difficult"
          ? record.difficulty
          : "",
    };

    return slot;
  });
}
