FROM ehyland/node-auto:debian-12 AS base

# install node
COPY --chown=app:app .nvmrc ./
RUN /docker/setup-env.sh

FROM base AS builder

# install deps
COPY --chown=app:app package.json pnpm-lock.yaml ./
RUN --mount=type=cache,uid=1000,gid=1000,id=pnpm,target=/home/app/.pnpm \
  pnpm install --prefer-offline

COPY --chown=app:app . .
RUN pnpm run build
RUN pnpm prune --prod

FROM base

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/resources /app/resources
COPY --from=builder /app/migrations /app/migrations

ENV PORT 8080

CMD [ "node", "dist/index.js" ]