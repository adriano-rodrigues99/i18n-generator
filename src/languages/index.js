import { TranslateTextCommand } from "@aws-sdk/client-translate";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../utils/logger.js";
import { Constants } from "../utils/constants.js";
import { client } from "../utils/aws.js";

export async function translate(text, from, to) {
  const input = {
    Text: text,
    SourceLanguageCode: from,
    TargetLanguageCode: to,
  };
  const command = new TranslateTextCommand(input);
  const response = await client.send(command);
  return response.TranslatedText;
}

export async function getLanguages() {
  const files = await readdir(Constants.languagesDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const languageFiles = {};

  for (const file of jsonFiles) {
    const languageName = path.parse(file).name;
    const filePath = path.join(Constants.languagesDir, file);

    try {
      const fileContent = await readFile(filePath, "utf-8");
      languageFiles[languageName] = JSON.parse(fileContent);
    } catch (error) {
      logger.error(`Error to process the file ${file}: ${error.message}`);
    }
  }

  return languageFiles;
}

export async function getLanguage(languageName) {
  const filePath = path.join(Constants.languagesDir, `${languageName}.json`);

  try {
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(filePath, "{}");
    }
    return getLanguage(languageName);
  }
}
