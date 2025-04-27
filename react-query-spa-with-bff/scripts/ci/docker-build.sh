#!/usr/bin/env bash

set -euxo pipefail

cd "$(dirname $0)/../.."

IMAGE="local/example-app:${IMAGE_TAG}"

docker build \
  --tag "$IMAGE" \
  --target "runtime" \
  --progress=plain \
  .

if [[ -n "${CI:-}" ]]; then
  print-docker-build-success-message "$IMAGE"
fi

if [[ "${1:-}" == "run" ]]; then
  docker run --rm -it "$IMAGE"
fi

