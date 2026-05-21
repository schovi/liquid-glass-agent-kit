#!/usr/bin/env bash
# Build the Liquid Glass showcase. Pass `release` for an optimized build.
#
#   ./scripts/build.sh           # debug
#   ./scripts/build.sh release   # -c release

set -euo pipefail

cd "$(dirname "$0")/.."

mode="${1:-debug}"
case "$mode" in
  debug)
    swift build
    ;;
  release)
    swift build -c release
    ;;
  *)
    echo "usage: $0 [debug|release]" >&2
    exit 2
    ;;
esac
