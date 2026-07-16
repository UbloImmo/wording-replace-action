run-ts:
    bun run src/ts/src/index.ts -v

gen-json-schema:
    ./scripts/generate-json-schema.sh

test-types:
    cd src/ts && bun test:types

test-types-watch:
    cd src/ts && bun test:types:watch

run-py:
    cd src/python && fastapi dev
