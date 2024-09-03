ARG PLAYWRIGHT_VERSION

FROM ehyland/node-auto:debian-12 AS base

# install node
COPY --chown=app:app .nvmrc ./
RUN /docker/setup-env.sh
  
FROM base AS deps
  
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
# install deps
COPY --chown=app:app package.json pnpm-lock.yaml ./
RUN --mount=type=cache,uid=1000,gid=1000,id=pnpm,target=/home/app/.pnpm \
  pnpm install --prefer-offline

FROM deps AS builder

COPY --chown=app:app . .
RUN ls -la
RUN pnpm run build
RUN pnpm prune --prod

FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-jammy AS playwright

COPY --from=builder /app/ /app/
COPY --from=deps /app/node_modules /app/node_modules
WORKDIR /app/

FROM base AS runtime

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/dist /app/dist

ENV PORT=8080

CMD [ "node", "dist/server" ]