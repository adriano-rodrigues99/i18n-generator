import { Constants } from "./utils/constants.js";
import { getLanguage, translate } from "./languages/index.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { logger } from "./utils/logger.js";

const MAX_CONCURRENT_REQUESTS = 20;

async function sortLanguages() {
  logger.info("Sorting languages...");

  const languagesKeys = [Constants.outputLanguages, Constants.inputLanguage];
  const languages = await Promise.all(
    languagesKeys.map((language) => getLanguage(language)),
  );
  const keys = Object.keys(languages[0]);

  const sortedLanguages = languages.map((language, index) => {
    logger.info(`Sorting "${languagesKeys[index]}" file...`);
    const sortedLanguage = {};
    keys.sort().forEach((key) => (sortedLanguage[key] = language[key]));
    return sortedLanguage;
  });

  await Promise.all(
    sortedLanguages.map((language, index) =>
      writeFile(
        path.join(Constants.languagesDir, `${languagesKeys[index]}.json`),
        JSON.stringify(language, null, 2),
      ),
    ),
  );

  logger.info("Languages sorted!");
}

async function processKey(baseLanguage, language, outputLanguage, key) {
  try {
    let translation;
    if (!baseLanguage[key]) {
      translation = baseLanguage[key];
    } else {
      translation = await translate(
        baseLanguage[key],
        Constants.inputLanguage,
        language,
      ).catch((e) => {
        logger.error(`Error translating key: "${key}"`);
        return baseLanguage[key];
      });
    }
    outputLanguage[key] = translation;
    return `Translated key: "${key}" with text: "${baseLanguage[key]}" to "${translation}" in ${language} language`;
  } catch (e) {
    logger.error(e);
  }
}

async function processLanguages() {
  const baseLanguage = await getLanguage(Constants.inputLanguage);
  const keys = Object.keys(baseLanguage);

  for (const language of Constants.outputLanguages) {
    logger.info(`Generating ${language} language...`);
    const outputLanguage = await getLanguage(language);

    const missingKeys = [];
    for (const key of keys) {
      if (outputLanguage[key] === undefined) missingKeys.push(key);
    }

    if (!missingKeys.length) {
      logger.warn(`No missing keys for ${language} language`);
      break;
    }

    logger.info("Generating chunks...");
    const chunks = [];
    for (let i = 0; i < missingKeys.length; i += MAX_CONCURRENT_REQUESTS) {
      chunks.push(missingKeys.slice(i, i + MAX_CONCURRENT_REQUESTS));
    }

    const translatedValues = [];
    for (const chunk of chunks) {
      const promises = chunk.map((key) =>
        processKey(baseLanguage, language, outputLanguage, key),
      );
      const results = await Promise.allSettled(promises);
      translatedValues.push(results.map((r) => r.value));
    }

    logger.info(`Writing ${language} language...`);

    const outputLanguageFile = `${language}.json`;
    const outputLanguageFilePath = path.join(
      Constants.languagesDir,
      outputLanguageFile,
    );
    await writeFile(
      outputLanguageFilePath,
      JSON.stringify(outputLanguage, null, 2),
    );
    logger.info(`Wrote ${language} language to ${outputLanguageFilePath}`);

    logger.info(`Writing ${language} log...`);
    const logFile = `${language}.log`;
    await mkdir(Constants.logsDir, { recursive: true });
    const logFilePath = path.join(Constants.logsDir, logFile);
    await writeFile(logFilePath, translatedValues.flat().join("\n"));
    logger.info(`Wrote ${language} log to ${logFilePath}`);
  }
}

async function main() {
  await processLanguages();
  await sortLanguages();
}

main().then();
