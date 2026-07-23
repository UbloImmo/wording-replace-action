import { mkdir, writeFile } from "fs/promises";

export async function writeFileSafe(filePath: string, data: string) {
  const pathParts = filePath.split("/");
  const dirParts = pathParts.slice(0, -1);
  const dir = dirParts.join("/");

  if (dir.length) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(filePath, data);
}
