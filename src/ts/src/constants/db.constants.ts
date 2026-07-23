import type { ValueMap } from "@ubloimmo/front-util";
import type { WordGender, WordNumber } from "../types/word.types";
import { Database } from "../types/db.types";
import type { SQL } from "bun";

export const DB_CONFIG = {
  adapter: "mysql",
  tls: true,
  host: "mysql",
  port: 3306,
  password: "root",
  username: "root",
  database: "morphalou",
  max: 10,
} satisfies SQL.Options;

export const DB_URL = `${DB_CONFIG.adapter}://${DB_CONFIG.username}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}?allowPublicKeyRetrieval=true&useSSL=false`;

export const DB_GENDER_MAP: ValueMap<WordGender, Database.Enums.Gender> = {
  m: "masculine",
  f: "feminine",
};

export const DB_NUMBER_MAP: ValueMap<WordNumber, Database.Enums.Number> = {
  singular: "singular",
  plural: "plural",
};

export const KEPT_MOODS = new Set<Database.Enums.Mood>([
  "imperative",
  "infinitive",
]);
