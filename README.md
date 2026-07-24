# wording-replace-action

A GitHub Action to automate the replacement of French words or sentences with specified aliases in Lingui PO catalog files, while preserving correct grammar and agreement. This is useful for adapting application wording to different contexts, such as gendered alternatives or custom terminology.

## What It Does

- Replaces words and phrases in Lingui PO (.po) catalog files with aliases provided in a JSON file or directory of JSON files.
- Maintains correct grammatical agreement for replaced words.
- Works on single PO files or batches of files using directories.
- Logs details of the changes for traceability.

## Technologies Used

- **Morphalou 3.1:** French language lexical database
- **SpaCy:** Python NLP toolkit for linguistic analysis
- **Lingui conf:** PO catalog parsing and serialization

## Usage

### Replace Aliases in a Single File

```yaml
- name: Replace wording in single PO catalog
  uses: UbloImmo/wording-replace-action
  with:
    aliases_json: path/to/aliases.json           # Mapping of original phrases to replacements
    input_catalog_po: path/to/input.po           # Source PO catalog file
    output_catalog_po: path/to/output.po         # Output PO catalog with replacements
```

### Replace Aliases in Multiple Files (Batch Mode)

All `.json` alias files in the directory will be applied to the input PO file, generating a new PO file for each alias mapping.

```yaml
- name: Replace wording in multiple catalogs using alias directory
  uses: UbloImmo/wording-replace-action
  with:
    aliases_json_dir: path/to/aliases_dir        # Directory containing multiple alias JSON files
    input_catalog_po: path/to/input.po           # Source PO catalog file
    output_catalog_dir: path/to/output_dir       # Output directory for resulting PO files
```

> [!Note]
> When used in dir mode, each output PO catalog file will inherit the name of its source alias JSON file.
>
> `aliases_dir/my_aliases_1.json` -> `output_dir/my_aliases_1.po`
> `aliases_dir/my_other_aliases_2.json` -> `output_dir/my_other_aliases_2.po`

## Example

See [.github/workflows/ci-test.yml](.github/workflows/ci-test.yml) for working usage in GitHub Actions, including how to run and test both single and multiple alias replacements.
