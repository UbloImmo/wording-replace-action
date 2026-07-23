import { createInterface } from "node:readline/promises";
import { exit, stdin, stdout } from "node:process";
import { toLowerCase } from "./string.utils";
import { Nullable } from "@ubloimmo/front-util";

export function interaction() {
  const readline = createInterface({ input: stdin, output: stdout });

  async function confirm(questionMessage: string): Promise<boolean> {
    const answer = await readline.question(`${questionMessage} (y/n)`);
    const choice = toLowerCase(answer.trim());
    switch (choice) {
      case "y":
      case "":
        return true;
      default:
        return false;
    }
  }

  async function input(inputPrompt: string): Promise<Nullable<string>> {
    const answer = await readline.question(inputPrompt);
    const choice = answer.trim();
    if (!choice.length) return null;
    return choice;
  }

  return {
    confirm,
    input,
    question: readline.question.bind(readline),
    close: readline.close.bind(readline),
  };
}
