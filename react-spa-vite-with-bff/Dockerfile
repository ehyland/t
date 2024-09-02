ARG PLAYWRIGHT_VERSION
ARG NODE_VERSION

FROM node:${NODE_VERSION}-slim as base

# rename user to match my perferences
RUN usermod -l app node \
  && groupmod -n app node

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# setup package manager
RUN corepack enable && pnpm --version 

FROM base as deps

# install deps
COPY --chown=app:app package.json pnpm-lock.yaml ./
RUN --mount=type=cache,uid=1000,gid=1000,id=pnpm,target=/home/app/.pnpm \
  pnpm install --prefer-offline

FROM deps as builder

COPY --chown=app:app . .
RUN pnpm run build
RUN pnpm prune --prod

FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-jammy as playwright

COPY --from=builder /app/ /app/
COPY --from=deps /app/node_modules /app/node_modules
WORKDIR /app/

FROM base AS runtime

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/public /app/public

ENV PORT 8080

CMD [ "node", "dist/server" ]