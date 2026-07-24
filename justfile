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

test: services-up
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose run --rm ts --aliases="/workspace/test/aliases.json" --input="/workspace/test/input.po" --output="/workspace/test/output.po" --logTo="/workspace/output/log.txt" --verbose="true"

inspect-ts:
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose run --rm --entrypoint sh ts

build-db-image:
    #!/usr/bin/env bash
    cd db_source
    docker buildx create --name multiarch --use 2>/dev/null || docker buildx use multiarch
    docker buildx build --platform linux/amd64,linux/arm64 -t blksnk/morphalou-mysql:latest --push .
