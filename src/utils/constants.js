import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const languagesDir = path.join(__dirname, "..", "languages");
const logsDir = path.join(__dirname, "..", "logs");

export const Constants = {
  outputLanguages: ["pt-BR"],
  inputLanguage: "en",
  __dirname,
  languagesDir,
  logsDir,
};
