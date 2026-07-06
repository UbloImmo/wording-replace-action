import { createInterface } from "node:readline/promises";
import { exit, stdin, stdout } from "node:process";
import { toLowerCase } from "./string.utils";

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
        console.log({ choice });
        return false;
    }
  }

  return {
    confirm,
    question: readline.question.bind(readline),
    close: readline.close.bind(readline),
  };
}
