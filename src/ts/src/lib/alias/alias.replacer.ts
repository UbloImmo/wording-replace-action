import type { MessageType } from "@lingui/conf";
import type { AliasData } from "../../types/alias.types";
import { analyseMessage } from "../api/api.replacer";
import { isNonEmptyStr } from "../../utils/predicate.utils";
import {
  isNumber,
  isObject,
  isString,
  objectKeys,
  type Nullable,
  type Optional,
} from "@ubloimmo/front-util";
import type { AliasLogger } from "../../utils/log.utils";
import type { POCatalog } from "../../types/po.types";
import type { AliasVariant } from "../../types/variant.types";
import { replaceRelatedWord } from "../db/db.replacer";
import { clone, splice } from "../../utils/string.utils";
import type { ReplacementItem } from "../../types/replacement.types";
import {
  OMITTED_RELATED_DEPENDENCIES,
  USED_AS_ADJECTIVE,
} from "../../constants/spacy.constants";
import { delay } from "../../utils/timing.utils";
import { interaction } from "../../utils/interaction.utils";
import { replaceDirectDet } from "../../utils/prefix.utils";
import { ALLOWED_MATCH_PREV_CHARS } from "../../constants/alias.constants";

export async function findReplacements(
  message: string,
  variant: AliasVariant,
  logger: AliasLogger
): Promise<ReplacementItem[]> {
  const replacements: ReplacementItem[] = [];

  // get basic matches
  const matchIndexes = new Set<number>();

  matchIdentification: for (let i = message.length; i >= 0; i--) {
    const matchIndex = message.substring(0, i).lastIndexOf(variant.match.word);
    if (matchIndex < 0) continue;
    // ensure we only match complete words or sequences, not nested ones
    // ex: do no match al[locataire]
    const prevChar = message[matchIndex - 1];
    if (isString(prevChar) && !ALLOWED_MATCH_PREV_CHARS.has(prevChar)) continue;

    // exclude matches that match to resolve to ignored words
    for (const ignore of variant.match.ignore) {
      const sliceFromMatchStart = message.substring(matchIndex);
      const sliceToMatchEnd = message.substring(
        0,
        matchIndex + variant.match.word.length
      );
      if (
        sliceFromMatchStart.startsWith(ignore) ||
        sliceToMatchEnd.endsWith(ignore)
      ) {
        logger.debug(`Ignore match ${ignore}`);
        continue matchIdentification;
      }
    }

    if (matchIndex >= 0) {
      matchIndexes.add(matchIndex);
    }
  }
  const analysis = await analyseMessage(message, variant, logger);
  logger.debug(analysis, "analysis");

  // remove matches based on analysis
  for (const matchedWord of analysis.matched) {
    logger.debug(matchedWord, "matchedWord");
    // only affect already found matches
    if (!matchIndexes.has(matchedWord.position)) continue;

    // remove matches where nouns were used as adjectives
    if (
      variant.match.ignoreAsAdjective &&
      matchedWord.dep === USED_AS_ADJECTIVE
    ) {
      matchIndexes.delete(matchedWord.position);
    }
    // if (
    //   OMITTED_MATCH_DEPENDENCIES.has(matchedWord.dep) &&
    //   matchIndexes.has(matchedWord.position)
    // ) {
    //   matchIndexes.delete(matchedWord.position);
    // }
  }
  // convert matches to replacements
  for (const matchIndex of matchIndexes) {
    replacements.push({
      replace: {
        word: variant.match.word,
        startIndex: matchIndex,
        endIndex: variant.match.word.length + matchIndex,
      },
      with: variant.replace.word,
    });
  }

  // only run related word replacement if at least one matched word was staged for replacement in previous step
  if (replacements.length) {
    // convert related words to replacements
    for (const relatedWord of analysis.related) {
      logger.debug(relatedWord, "relatedWord");
      // skip non grammar-related related words
      if (OMITTED_RELATED_DEPENDENCIES.has(relatedWord.dep)) continue;

      const replacedWord = await replaceRelatedWord(relatedWord, logger);
      // only results different from initial word
      if (!replacedWord || replacedWord === relatedWord.word) continue;

      replacements.push({
        replace: {
          word: relatedWord.word,
          startIndex: relatedWord.position,
          endIndex: relatedWord.position + relatedWord.word.length,
        },
        with: replacedWord,
      });
    }

    // reprelace determinants and contract if needed
    for (const det of analysis.dets) {
      logger.debug(det, "det");
      // only try to contract if directly in front of matched word
      const isDirectDet = analysis.matched.some(
        (match) => match.wordIndex - det.wordIndex === 1
      );
      logger.debug({ isDirectDet });
      if (!isDirectDet) continue;
      const replacedDet = replaceDirectDet(det, variant, logger);
      if (replacedDet) {
        replacements.push(replacedDet);
      }
    }
  }

  // sort replacements so that we start replacing starting from the end of the string
  return replacements.toSorted((a, b) => {
    return b.replace.startIndex - a.replace.startIndex;
  });
}

const ENTRY_REPLACEMENTS = new Set<ReplacementItem>();

export async function replaceEntry(
  entry: MessageType,
  aliasData: AliasData,
  index: number,
  logger: AliasLogger
): Promise<Nullable<{ message: string; matched: number; replaced: number }>> {
  let message = entry.translation;

  if (!isNonEmptyStr(message)) return null;

  let matchedCount = 0;
  let directReplacementCount = 0;

  ENTRY_REPLACEMENTS.clear();
  for (const [matchText, variant] of aliasData.aliasMap) {
    if (message.includes(matchText)) {
      matchedCount++;

      // perf gain: no need to run python NLP if we replace the whole match as is
      if (message === matchText) {
        message = variant.replace.word;
        directReplacementCount++;
        // TODO: check if we can gain even more perf by breaking instead of continuing
        continue;
      }

      // get variant replacements
      const replacements = await findReplacements(message, variant, logger);

      logger.debug(replacements, "replacements");

      // sequencially apply replacements to message
      for (const replacement of replacements) {
        console.log(replacement.replace.startIndex);
        ENTRY_REPLACEMENTS.add(replacement);
        const replaced = splice(
          message,
          replacement.replace.startIndex,
          replacement.replace.endIndex,
          replacement.with
        );
        message = replaced;
      }
    }
  }

  const replacedCount = ENTRY_REPLACEMENTS.size + directReplacementCount;

  if (message !== entry.translation) {
    logger.info(`
      Applied aliases to entry ${index}:
        original: "${entry.translation}"
        aliased:  "${message}"
      `);
    if (ENTRY_REPLACEMENTS.size) {
      logger.info(`
      Performed ${ENTRY_REPLACEMENTS.size} replacements:
      ${[...ENTRY_REPLACEMENTS.values()].map((r) => `- ${r.replace.word} -> ${r.with}`).join("\n      ")}
      `);
    } else {
      logger.info(`
        Performed a direct replacement.
      `);
    }
    return { message, matched: matchedCount, replaced: replacedCount };
  }
  logger.debug(`
  Kept entry ${index}:
    "${entry.translation}"
  `);

  return { message, matched: matchedCount, replaced: replacedCount };
}

let LIMIT: Optional<number>;
let DELAY: Optional<number>;
let TARGET_ENTRY: Optional<number>;
let INITIAL_ENTRY: Optional<number>;
let STEP: Optional<boolean>;
// STEP = true;
// DELAY = 1000;
// TARGET_ENTRY = 258;
// INITIAL_ENTRY = 240;

export async function replacePOCatalogEntries(
  catalog: POCatalog,
  aliasData: AliasData,
  logger: AliasLogger
): Promise<POCatalog> {
  const replacements = new Map<string, MessageType>();
  if (!aliasData.aliasMap.size) return catalog;
  const interact = interaction();

  logger.line();

  let i = 0;

  for (const key in catalog) {
    const entry = catalog[key];
    if (!entry || entry.obsolete) {
      i++;
      continue;
    }

    if (isNumber(LIMIT) && i >= LIMIT) break;

    if (
      (isNumber(TARGET_ENTRY) && i !== TARGET_ENTRY) ||
      (isNumber(INITIAL_ENTRY) && i < INITIAL_ENTRY)
    ) {
      i++;
      continue;
    }

    const result = await replaceEntry(entry, aliasData, i, logger);
    if (isObject(result)) {
      logger.line();
      if (result.matched) {
        if (result.replaced) {
          replacements.set(key, { ...entry, translation: result.message });
        } else {
          if (!result.replaced) {
            logger.error(
              `Matched at least ${result.matched} variants but did not replace any.`
            );
          }
        }

        // TODO: dev control flow, remove once we iron out the details
        if (STEP) {
          const doNext = await interact.confirm("Parse next entry ?");

          if (!doNext) {
            logger.debug("Aborted further entry replacement");
            break;
          }
        }

        if (isNumber(DELAY)) {
          await delay(DELAY);
        }
      }
    }
    i++;
  }

  logger.info(
    `Replaced ${replacements.size} entries out of ${objectKeys(catalog).length}.`
  );

  interact.close();

  // apply replacements
  for (const [key, entry] of replacements) {
    catalog[key] = entry;
  }

  return catalog;
}
