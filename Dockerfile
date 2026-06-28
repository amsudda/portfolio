# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:22-slim AS build
WORKDIR /app

# Install all deps (incl. dev) for the build
COPY package*.json ./
RUN npm ci

COPY . .

# Build the TanStack Start app targeting a plain Node server (Nitro node-server
# preset → .output/server/index.mjs). Without this it would target Cloudflare.
ENV NITRO_PRESET=node-server
RUN npm run build

# ---------- runtime ----------
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Only production deps (pg + runtime libs). `pg` is resolved at runtime by the
# bundled server via a dynamic import.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built server + public assets
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
