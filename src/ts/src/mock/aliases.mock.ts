import type { AliasCollection } from "../types/alias.types";

export const MOCK_ALIASES: AliasCollection = [
  {
    match: {
      singular: "lot",
      plural: "lots",
      gender: "m",
    },
    replace: {
      singular: "lot",
      plural: "lots",
      gender: "m",
    },
  },
  {
    match: {
      singular: "locataire",
      plural: "locataires",
      gender: "m",
    },
    replace: {
      singular: "propriétaire BRS",
      plural: "propriétaires BRS",
      gender: "m",
    },
  },
  {
    match: [
      {
        singular: "gestionnaire",
        plural: "gestionnaires",
        gender: "m",
        ignoreAsAdjective: true,
      },
      {
        singular: "bailleur",
        plural: "bailleurs",
        gender: "m",
      },
    ],
    replace: {
      singular: "OFS",
      plural: "OFS",
      gender: "m",
    },
  },
  {
    match: {
      singular: "dossier de location",
      plural: "dossiers de location",
      gender: "m",
    },
    replace: {
      singular: "dossier propriétaire BRS",
      plural: "dossiers propriétaire BRS",
      gender: "m",
    },
  },
  {
    match: {
      singular: "location",
      plural: "locations",
      gender: "f",
    },
    replace: {
      singular: "dossier",
      plural: "dossiers",
      gender: "m",
    },
  },
  {
    match: [
      {
        singular: "contrat de location",
        plural: "contrats de location",
        gender: "m",
      },
      {
        singular: "contrat",
        plural: "contrats",
        gender: "m",
        ignore: [
          { singular: "contrat d'assurance", plural: "contrats d'assurance" },
          {
            singular: "contrat de bail",
            plural: [
              "contrats de bail",
              "contrats de bails",
              "contrats de baux",
            ],
          },
        ],
      },
    ],
    replace: {
      singular: "acte notarié",
      plural: "actes notariés",
      gender: "m",
    },
  },
  {
    match: [
      {
        singular: "bail",
        plural: ["bails", "baux"],
        gender: "m",
      },
      {
        singular: "contrat de bail",
        plural: ["contrats de bail", "contrats de bails", "contrats de baux"],
        gender: "m",
      },
    ],
    replace: {
      singular: "contrat",
      plural: "contrats",
      gender: "m",
    },
  },
  {
    match: {
      singular: "loyer",
      plural: "loyers",
      gender: "m",
    },
    replace: {
      singular: "redevance",
      plural: "redevances",
      gender: "f",
    },
  },
  {
    match: {
      singular: "nouveau loyer",
      plural: "nouveaux loyers",
      gender: "m",
    },
    replace: {
      singular: "nouvelle redevance",
      plural: "nouvelles redevances",
      gender: "f",
    },
  },
  {
    match: {
      singular: "loyer précédent",
      plural: "loyers précédents",
      gender: "m",
    },
    replace: {
      singular: "redevance précédente",
      plural: "redevances précédentes",
      gender: "f",
    },
  },
];
