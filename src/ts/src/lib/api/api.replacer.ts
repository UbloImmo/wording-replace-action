import { PYTHON_API_URL } from "../../constants/api.constants";
import type { API } from "../../types/api.types";
import type { AliasVariant } from "../../types/variant.types";
import type { AliasLogger } from "../../utils/log.utils";

const REPLACE_API_URL = `${PYTHON_API_URL}/replace`;
const RELATED_API_URL = `${PYTHON_API_URL}/analyze`;

export async function callReplaceApi(
  message: string,
  variant: AliasVariant,
  logger: AliasLogger
): Promise<string> {
  logger.log(
    `Replacing "${variant.match.word}" with "${variant.replace.word}" in message "${message}"`
  );
  const body = JSON.stringify({
    message,
    match: variant.match,
    replace: variant.replace,
  });

  try {
    const response = await fetch(REPLACE_API_URL, {
      body,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    logger.log(`Got replaced text: "${text}"`);
    return text;
  } catch (e) {
    logger.error(e);
    return message;
  }
}

export async function analyseMessage(
  message: string,
  variant: AliasVariant,
  logger: AliasLogger
): Promise<API.AnalyseMessageResponse> {
  logger.info(
    `Analyzing usage of "${variant.match.word}" in message "${message}"`
  );
  const body = JSON.stringify({
    message,
    match: variant.unprefixedMatch,
    replace: variant.unprefixedReplace,
  });

  try {
    const response = await fetch(RELATED_API_URL, {
      body,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = (await response.json()) as API.AnalyseMessageResponse;
    logger.info(
      `Matched ${json.matched.length} words to replace & ${json.related.length} related words to update: ${json.related.map(({ word }) => `"${word}"`).join(", ")}`
    );
    return json;
  } catch (e) {
    logger.error(e);
    return {
      matched: [],
      related: [],
      dets: [],
    };
  }
}
