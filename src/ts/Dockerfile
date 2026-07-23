FROM oven/bun:1

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install --frozen-lockfile

COPY . .

ENTRYPOINT [ "bun", "run", "/app/src/index.ts" ]
