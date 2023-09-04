#!/usr/bin/env bash

set -euxo pipefail

cd "$(dirname $0)/../.."

: ${IMAGE_NAME?}
: ${IMAGE_TAG?}

IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

docker build -t "$IMAGE" .

if [[ "${1:-}" == "run" ]]; then
  docker run --rm -it "$IMAGE"
fi

