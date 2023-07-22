FROM registry.gitlab.com/ehyland/private/node-auto:debian-11 as base

# install node
COPY --chown=app:app .nvmrc ./
RUN /docker/setup-env.sh

FROM base as builder

# install deps
COPY --chown=app:app package.json pnpm-lock.yaml ./
RUN --mount=type=cache,uid=1000,gid=1000,id=pnpm,target=/home/app/.pnpm \
  pnpm install --prefer-offline

COPY --chown=app:app . .
RUN pnpm run build
RUN pnpm prune --prod

FROM base

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

ENV PORT 8080

CMD [ "node", "dist" ]