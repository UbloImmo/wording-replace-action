from spacy.language import Language
from spacy.tokens import Token
from spacy.tokens.doc import Doc

from classes import MatchedWord, RelatedToken, RelatedWord, WordMatch


def is_match(text_doc: Doc, matcher_doc: Doc, i: int):
  if len(matcher_doc) == 1:
    print(matcher_doc[0].lemma_)
    print(text_doc[i].lemma_)
    lemma_match = text_doc[i].lemma_.lower() == matcher_doc[0].lemma_.lower()
    text_match = text_doc[i].text.lower() == matcher_doc[0].text.lower()
    return lemma_match or text_match
    # return lemma_match

  if i + len(matcher_doc) > len(text_doc):
    return False

  return " ".join([t.lemma_.lower() for t in text_doc[i : i + len(matcher_doc)]]) == " ".join(
    [t.lemma_.lower() for t in matcher_doc]
  )


def is_token_related(token_a: Token, token_b: Token) -> bool:

  is_related = token_a.is_ancestor(token_b) or token_b.is_ancestor(token_a)

  is_related_direct = token_a in token_b.children or token_b in token_a.children


  if is_related_direct or is_related:
    print()
    print("matched token:", token_a.text)
    print("children", [t.text for t in token_a.children])
    print()
    print("maybe related token:", token_b.text)
    print([t.text for t in token_b.children])
    print([t.dep_ for t in token_b.children])
    print()
    print("-> is related", is_related)
    print("-> is related direct", is_related_direct)
    print(token_b.dep_)

  if not is_related_direct:
    return False

  # omit verbs with passive subjects
  # example: "Activé par le locataire"
  #             ^              ^
  #         token_b (ROOT)   token_a (obl:agent)
  # "Activé" is omitted
  if token_b.dep_ == "ROOT" and token_a.dep_ == "obl:agent":
    return False

  return True


def get_related_tokens(text_doc: Doc, matcher_doc: Doc) -> tuple[set[RelatedToken], list[Token]]:
  matched_tokens: list[Token] = []
  related_tokens: set[RelatedToken] = set()

  # first traverse doc to find matching tokens
  i = 0
  while i < len(text_doc):
    token = text_doc[i]
    if is_match(text_doc, matcher_doc, i):
      matched_tokens.append(token)
    i += len(matcher_doc)

  print([t.text for t in matched_tokens])

  # abort if no matched tokens
  if len(matched_tokens) == 0:
    return related_tokens, matched_tokens

  # then find all related words
  i = 0
  while i < len(text_doc):
    token = text_doc[i]

    for matched_token in matched_tokens:
      if is_token_related(matched_token, token):
        related_tokens.add(RelatedToken(token=token, related_to_token=matched_token))

        print(token.i, token.idx, token.text)

    i += len(matcher_doc)

  return related_tokens, matched_tokens


GENDER_MAPPING = {"Masc": "m", "Fem": "f"}
NUMBER_MAPPING = {"Sing": "singular", "Plur": "plural"}

CLIENT_GENDER_MAPPING = {
  "m": "Masc",
  "f": "Fem",
}
CLIENT_NUMBER_MAPPING = {
  "singular": "Sing",
  "plural": "Plur",
}

DIRECT_DET_DEPS: set[str] = set(["det", "case"])


def get_word_match_gender_and_number(word_match: WordMatch):
  number = CLIENT_NUMBER_MAPPING[word_match.number]
  gender = CLIENT_GENDER_MAPPING[word_match.gender]
  return (
    gender,
    number,
  )


def normalize_gender_and_number(gender: str, number: str):
  return GENDER_MAPPING[gender], NUMBER_MAPPING[number]


def get_token_gender_and_number(token: Token, default_gender: str, default_number: str):
  gender_raw = token.morph.get("Gender", [default_gender])[0]
  number_raw = token.morph.get("Number", [default_number])[0]

  return gender_raw, number_raw


def token_needs_inflection(related_token: RelatedToken, replace: WordMatch):
  gender_replace_raw, number_replace_raw = get_word_match_gender_and_number(replace)

  gender_token_raw, number_token_raw = get_token_gender_and_number(
    related_token.token, gender_replace_raw, number_replace_raw
  )

  # if the sentence's subject is something else that refers to current match, keep their number/gender the same
  is_passive = (
    related_token.token.dep_ == "ROOT" and related_token.related_to_token.dep_ == "obl:arg"
  )
  if is_passive:
    gender_replace_raw = gender_token_raw
    number_replace_raw = number_token_raw

  gender_replace, number_replace = normalize_gender_and_number(
    gender_replace_raw, number_replace_raw
  )
  gender_token, number_token = normalize_gender_and_number(gender_token_raw, number_token_raw)

  print(
    {
      "gender_token": gender_token,
      "gender_replace": gender_replace,
      "number_token": number_token,
      "number_replace": number_replace,
    }
  )

  needs_inflection = gender_token != gender_replace or number_token != number_replace

  return (
    needs_inflection,
    gender_replace,
    number_replace,
    gender_token,
    number_token,
  )


def fix_token_dep(token: Token):
  # mark word as used as noun instead of adjective if no children or a single det
  if token.dep_ != "amod":
    return

  children = [child for child in token.children]

  # either a single ROOT or det child
  if len(children) == 1:
    child = children[0]
    if child.dep_ == "det" or child.dep_ == "ROOT":
      token.dep_ = "nsubj"

      print(f"Converted {token.text} 's dep from 'amod' to 'nsubj'")


def analyze_message(nlp: Language, text: str, match: WordMatch, replace: WordMatch):
  text_doc = nlp(text)
  matcher_doc = nlp(match.word)

  print()
  print("analysing message:\n", text)
  print("matching: ", match.word)

  related_tokens, matched_tokens = get_related_tokens(text_doc, matcher_doc)

  related: list[RelatedWord] = []

  dets: list[RelatedWord] = []

  for related_token in related_tokens:
    needs_inflection, target_gender, target_number, initial_gender, initial_number = (
      token_needs_inflection(related_token, replace)
    )

    print(related_token.token.text, "needs inflection: ", needs_inflection)

    related_word = RelatedWord(
      word=related_token.token.text,
      wordIndex=related_token.token.i,
      lemma=related_token.token.lemma_,
      position=related_token.token.idx,
      dep=related_token.token.dep_,
      targetGender=target_gender,
      targetNumber=target_number,
      gender=initial_gender,
      number=initial_number,
    )

    if related_word.dep in DIRECT_DET_DEPS:
      dets.append(related_word)
      continue

    if not needs_inflection:
      continue

    related.append(related_word)

  matched: list[MatchedWord] = []
  for matched_token in matched_tokens:
    fix_token_dep(matched_token)
    matched.append(
      MatchedWord(
        word=matched_token.text,
        lemma=matched_token.lemma_,
        position=matched_token.idx,
        wordIndex=matched_token.i,
        dep=matched_token.dep_,
      )
    )

  return related, matched, dets
