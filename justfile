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

services-up:
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose up -d --wait mysql python

services-down:
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose down -v

exec: services-up
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose run --build --rm ts --aliases="/workspace/input/aliases.json" --input="/workspace/input/messages.po" --output="/workspace/output/messages.po" --logTo="/workspace/output/log.txt" --verbose="false"

inspect-ts:
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose run --rm --entrypoint sh ts
