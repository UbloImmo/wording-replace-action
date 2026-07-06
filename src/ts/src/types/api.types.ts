import type { SpacyDependency } from "./spacy.types";
import type { Word, WordGender, WordNumber } from "./word.types";

export namespace API {
  export type RelatedWord = {
    word: Word;
    lemma: string;
    gender: WordGender;
    number: WordNumber;
    targetGender: WordGender;
    targetNumber: WordNumber;
    dep: SpacyDependency;
    position: number;
    wordIndex: number;
  };

  export type MatchedWord = {
    word: Word;
    lemma: string;
    dep: SpacyDependency;
    position: number;
    wordIndex: number;
  };

  export type AnalyseMessageResponse = {
    /**
     * Matched words to be replaced in string
     */
    matched: MatchedWord[];
    /**
     * Words related to the matched word(s) in string that need inflection
     */
    related: RelatedWord[];
    /**
     * Direct prefixes of matched words that do not need inflection but may need contraction
     */
    dets: RelatedWord[];
  };
}
