import type { SpacyDependency } from "../types/spacy.types";

export const OMITTED_RELATED_DEPENDENCIES = new Set<SpacyDependency>([
  "punct",
  "obl:arg",
  "conj",
  "cc",
  "cc:preconj",
  "case",
  "nmod",
  "acl",
]);

export const USED_AS_ADJECTIVE: SpacyDependency = "amod";
export const OMITTED_MATCH_DEPENDENCIES = new Set<SpacyDependency>(["amod"]);
