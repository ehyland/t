#!/usr/bin/env bash

set -euxo pipefail

cd "$(dirname $0)/../.."

: ${CI_DOCKER_REGISTRY?} ${IMAGE_TAG?}

eval $(./scripts/docker-build-args.cjs)

IMAGE="${CI_DOCKER_REGISTRY}/example:${IMAGE_TAG}"

docker build . \
  --tag "$IMAGE" \
  --target "runtime" \
  --build-arg "NODE_VERSION=${NODE_VERSION}" \
  --build-arg "PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION}"

if [[ -n "${CI:-}" ]]; then
  print-docker-build-success-message "$IMAGE"
fi

if [[ "${1:-}" == "push" ]]; then
  docker push "$IMAGE"
  buildkite-agent annotate --style "success" --context "push" "Published \`$IMAGE\`"
fi

if [[ "${1:-}" == "run" ]]; then
  docker run --rm -it "$IMAGE"
fi

