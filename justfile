set positional-arguments

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

test:
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose run --build --rm ts --aliases="/workspace/tests/multi/aliases_2.json" --input="/workspace/tests/multi/input.po" --output="/workspace/tests/multi/aliases_2.po" --logTo="/workspace/tests/multi/log.txt" --verbose="true"

inspect-ts:
    GITHUB_WORKSPACE="$HOME/code/projects/words" docker compose run --rm --entrypoint sh ts

# Builds morphalou-mysql with a pre-initialized datadir (see db_source/Dockerfile)
# and pushes linux/amd64 + linux/arm64. First build is slow (~SQL import per platform).
build-db-image:
    #!/usr/bin/env bash
    set -euo pipefail
    cd db_source
    if ! docker buildx inspect multiarch >/dev/null 2>&1; then
      docker buildx create --name multiarch --driver docker-container --use
    else
      docker buildx use multiarch
    fi
    docker buildx inspect --bootstrap
    docker buildx build \
      --platform linux/amd64,linux/arm64 \
      --tag blksnk/morphalou-mysql:latest \
      --push \
      --progress=plain \
      .

@release-action tag description:
    #!/usr/bin/env bash
    git tag -a -m "$2" "$1"
    git push --follow-tags