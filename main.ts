// Cat Reviews Its Human — make.fun program/v1 entry.
// Reads the one-line review from entry.txt and writes it to /output/entry.txt,
// exactly as the competition gate requires (UTF-8, 1-200 chars, single line).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// Enforces the kit gate in full (RULES.txt, "The gate"): the output must be
// UTF-8 text of 1 to 200 characters, not only white space, on a single line.
// The previous inline checks missed two of these: readFileSync("utf8")
// silently replaces invalid UTF-8 bytes with U+FFFD instead of failing, and
// nothing checked the entry was more than whitespace. This guard runs before
// anything is written, so an invalid entry fails loudly instead of shipping.
function validateEntry(raw: Buffer): string {
  let line: string;
  try {
    line = new TextDecoder("utf-8", { fatal: true }).decode(raw);
  } catch {
    throw new Error("entry.txt is not valid UTF-8");
  }
  line = line.trim();
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (!/\S/.test(line)) {
    throw new Error("entry must not be only white space");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  return line;
}

const line = validateEntry(readFileSync(join(here, "entry.txt")));
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line + "\n", "utf8");
console.log(`Wrote ${line.length} characters to /output/entry.txt`);
