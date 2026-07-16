
# Delete existing schema if already present

if [ -f ./schema.json ]; then rm ./schema.json; fi

# Generate new JSON schema from typescript type definition
cd src/ts
bunx ts-json-schema-generator --path './src/types/alias.types.ts' --type 'AliasInput' --out ../../schema.json

# Allow additional properties on the root object crate
cd ../..
jq '.definitions.AliasInput.additionalProperties = true' ./schema.json > ./schema.tmp
mv ./schema.tmp ./schema.json
