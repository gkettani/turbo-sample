# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1
ARG NODE_VERSION=20.16.0
ARG DEBIAN_VERSION=12.8
FROM node:${NODE_VERSION}-slim AS install

WORKDIR /app

# Copy root package.json and lockfile
COPY package.json package-lock.json ./
 
# Copy the server package.json
COPY apps/server/package.json ./apps/server/package.json

# Copy all internal dependencies required for the server
COPY packages/api/package.json ./packages/api/package.json
 
RUN npm ci --include=dev

# build
FROM oven/bun:${BUN_VERSION}-slim AS build
ENV NODE_ENV="production"

WORKDIR /app/apps/server
COPY --link "." "/app/"
COPY --from=install --link "/app/node_modules" "/app/node_modules"

RUN bun build --compile --sourcemap src/index.ts --outfile=app

# runtime
FROM debian:${DEBIAN_VERSION}-slim AS runtime
COPY \
    --from=build \
    --chown=1000:1000 \
    --chmod=555 \
    --link \
    "/app/apps/server/app" "/bin/"
USER 1000:1000
EXPOSE 3000
ENTRYPOINT ["/bin/app"]
