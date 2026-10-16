#!/usr/bin/env bash
set -euo pipefail

cd /workspace
npm ci
npx --no-install playwright install --with-deps chromium firefox webkit
