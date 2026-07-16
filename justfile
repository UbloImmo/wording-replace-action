run-ts:
    bun run src/ts/src/index.ts -v

gen-json-schema:
    cd src/ts && bunx ts-json-schema-generator --path './src/types/alias.types.ts' --type 'AliasInput' --out ../../schema.json

test-types:
    cd src/ts && bun test:types

test-types-watch:
    cd src/ts && bun test:types:watch

run-py:
    cd src/python && fastapi dev
