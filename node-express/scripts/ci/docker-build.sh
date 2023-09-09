#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname $0)/../.."

: ${IMAGE_NAME?}
: ${IMAGE_TAG?}

IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

docker build -t "$IMAGE" .

IMAGE_SIZE=$(
  docker inspect -f "{{ .Size }}" "$IMAGE" | numfmt --to=si
)

echo "Built $IMAGE" 
echo "Size $IMAGE_SIZE" 

if [[ "${1:-}" == "run" ]]; then
  ENV="${ENV:-development}"
  PORT="${PORT:-4000}"
  docker run --rm -it \
    -p "${PORT}:${PORT}" \
    -e PORT=${PORT} \
    -e ENV=${ENV} \
    "$IMAGE"
fi

