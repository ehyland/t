#!/usr/bin/env bash

ENV=dev \
NODE_ENV=development \
  node \
    --watch \
    --watch-path ./src/server \
    --watch-preserve-output \
    --import tsx src/server/index.ts