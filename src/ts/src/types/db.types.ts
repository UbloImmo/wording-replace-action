import type { Enum } from "@ubloimmo/front-util";
import type { RowDataPacket } from "mysql2/promise";

export namespace Database {
  export namespace Enums {
    export const Categories = [
      "commonNoun",
      "adjective",
      "verb",
      "interjection",
      "adverb",
      "preposition",
      "pronoun",
      "determiner",
      "conjunction",
      "numeral",
    ] as const;
    export type Category = Enum<typeof Categories>;

    export const SubCategories = [
      "people",
      "abbreviation",
      "auxiliary",
      "impersonal",
      "defective",
      "onomatopoeia",
      "negation",
      "determinant",
      "adjective",
      "demonstrative",
      "possessive",
      "personal",
      "relative",
      "indefinite",
      "interrogative",
      "exclamatory",
      "definite",
      "negative",
      "subordination",
      "coordination",
    ] as const;
    export type SubCategory = Enum<typeof SubCategories>;

    export const Genders = [
      "masculine",
      "feminine",
      "neuter",
      "invariable",
    ] as const;
    export type Gender = Enum<typeof Genders>;

    export const Numbers = ["singular", "plural", "invariable"] as const;
    export type Number = Enum<typeof Numbers>;

    export const Persons = [
      "firstPerson",
      "secondPerson",
      "thirdPerson",
    ] as const;
    export type Person = Enum<typeof Persons>;

    export const Moods = [
      "indicative",
      "participle",
      "subjunctive",
      "imperative",
      "infinitive",
      "conditional",
    ] as const;
    export type Mood = Enum<typeof Moods>;

    export const Tenses = [
      "simplePast",
      "imperfect",
      "present",
      "future",
      "past",
    ] as const;
    export type Tense = Enum<typeof Tenses>;
  }

  export type ID = number;

  export namespace Table {
    export type Lemma = {
      lemmaID: ID;
      content: string;
      category?: Enums.Category;
      subCategory?: Enums.SubCategory;
      gender?: Enums.Gender;
      variantOf?: ID;
      feminineOf?: ID;
      pronominalOf?: ID;
    };

    export type Inflection = {
      inflectionID: ID;
      lemmaID: ID;
      content: string;
      number?: Enums.Number;
      gender?: Enums.Gender;
      person?: Enums.Person;
      mood?: Enums.Mood;
      tense?: Enums.Tense;
    };
  }

  export namespace Row {
    export interface Lemma extends RowDataPacket, Table.Lemma {}
    export interface Inflection extends RowDataPacket, Table.Inflection {}
  }

  export namespace Group {
    export type LemmaInflections = {
      lemma: Table.Lemma;
      inflections: Row.Inflection[];
    };
  }
}
