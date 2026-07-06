import type { Enum } from "@ubloimmo/front-util";

export const SpacyDependencies = [
  "nsubj", // nominal subject
  "nsubj:pass", // passive nominal subject
  "nsubj:outer", // outer nominal suject
  "obj", // direct object
  "iobj", // indirect object
  "csubj", // clausal suject
  "csubj:pass", // clausal passive suject
  "csubj:outer", // outer clausal suject
  "ccomp", // clausal complement -> That [action]
  "xcomp", // open clausal complement -> To [action]
  "obl", // oblique nominal -> To somewhere
  "obl:agent", // oblique agent -> By somebody / something
  "obl:arg", // oblique argument
  "obl:lmod", // oblique locative modifier -> Location
  "obl:tmod", // oblique temporal argument -> Time
  "vocative", // vocative -> [Name], ...
  "expl", // expletive
  "expl:impers", // impersonal expletive
  "expl:pass", // reflexive xpletive
  "expl:pv", // inherently reflexive
  "dislocated", // dislocated element
  "advcl", // adverbial clause -> If this, [then that]
  "advcl:relcl", // adverbial relative clause
  "nmod", // nominal modifier -> [Apple] pie
  "nmod:poss", // possessive nominal modifier -> [John's] pie
  "nmod:tmod", // temporal nominal modifier
  "appos",
  "nummod",
  "nummod:gov",
  "acl",
  "acl:relcl",
  "amod",
  "det",
  "det:numgov",
  "det:nummod",
  "det:poss",
  "clf",
  "case",
  "conj",
  "cc",
  "cc:preconj",
  "fixed",
  "flat",
  "flat:name",
  "flat:foreign",
  "compound",
  "compound:prt",
  "compound:lvc",
  "compound:redup",
  "compound:svc",
  "list",
  "parataxis",
  "aux",
  "aux:pass",
  "cop",
  "mark",
  "advmod",
  "advmod:emph",
  "advmod:lmod",
  "discourse",
  "punct",
  "ROOT",
  "orphan",
  "goeswith",
  "reparandum",
  "dep",
] as const;
export type SpacyDependency = Enum<typeof SpacyDependencies>;
