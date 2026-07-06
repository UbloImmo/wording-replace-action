import type { Nullable, Optional } from "@ubloimmo/front-util";
import { Database } from "../../types/db.types";
import type { API } from "../../types/api.types";
import type { AliasLogger } from "../../utils/log.utils";
import { DB, DB_POOL } from "./db.client";
import {
  DB_GENDER_MAP,
  DB_NUMBER_MAP,
  KEPT_MOODS,
} from "../../constants/db.constants";
import { matchCase, toLowerCase } from "../../utils/string.utils";

export async function replaceRelatedWord(
  relatedWord: API.RelatedWord,
  logger: AliasLogger
): Promise<Nullable<string>> {
  logger.info(
    `Replacing related word "${relatedWord.word}" using lemma "${relatedWord.lemma}"`
  );
  logger.debug(relatedWord);

  const [lemmaCandidates] = await DB_POOL.query<Database.Row.Lemma[]>(
    `SELECT * FROM lemma WHERE content = ?`,
    [relatedWord.lemma]
  );

  logger.debug(lemmaCandidates, "lemmaCandidates");

  const candidate = await selectLemmaCandidate(lemmaCandidates);
  logger.debug(candidate, "candidate");
  if (!candidate) return null;

  logger.log(
    `Selected lemma ${candidate.lemma.lemmaID} "${candidate.lemma.content}" (${candidate.inflections.length} inflections: ${candidate.inflections.map(({ content }) => `"${content}"`).join(", ")})`
  );

  const inflection = selectInflection(
    relatedWord,
    candidate.inflections,
    logger
  );

  if (!inflection) return null;
  logger.log(
    `Selected inflection ${inflection?.inflectionID} "${inflection.content}"`
  );

  const replacementWord = matchCase(relatedWord.word, inflection.content);

  logger.info(
    `Replaced related word: ${relatedWord.word} -> ${replacementWord}`
  );

  return replacementWord;
}

async function selectLemmaCandidate(
  lemmas: Database.Row.Lemma[]
): Promise<Nullable<Database.Group.LemmaInflections>> {
  if (!lemmas.length) return null;
  let candidate: Optional<Database.Group.LemmaInflections>;

  for (const lemma of lemmas) {
    const [inflections] = await DB_POOL.query<Database.Row.Inflection[]>(
      "SELECT * FROM inflection WHERE lemmaID = ?",
      [lemma.lemmaID]
    );
    if (!inflections.length) continue;
    if (!candidate || inflections.length > candidate.inflections.length) {
      candidate = { lemma, inflections };
    }
  }

  return candidate ?? null;
}

function selectInflection(
  relatedWord: API.RelatedWord,
  inflections: Database.Row.Inflection[],
  logger: AliasLogger
) {
  if (!inflections.length) return null;

  // const relatedInflection = inflections.find(
  //   (inflection) => inflection.content === toLowerCase(relatedWord.word)
  // );

  // do not replace imperative or
  const keptMoodInflections = [...inflections].filter(
    (inflection) =>
      inflection.mood &&
      KEPT_MOODS.has(inflection.mood) &&
      inflection.content === toLowerCase(relatedWord.word)
  );
  logger.debug(relatedWord, "relatedWord");
  if (keptMoodInflections.length) return null;

  const targetNumber = DB_NUMBER_MAP[relatedWord.targetNumber];
  const baseTargetGender = DB_GENDER_MAP[relatedWord.targetGender];
  const targetGenders = new Set<Database.Enums.Gender>(
    targetNumber === "singular"
      ? [baseTargetGender]
      : [baseTargetGender, "invariable"]
  );

  logger.debug({ targetGender: baseTargetGender, targetNumber });

  return (
    inflections.find(
      (inflection) =>
        inflection.gender &&
        targetGenders.has(inflection.gender) &&
        inflection.number === targetNumber
    ) ?? null
  );
}
