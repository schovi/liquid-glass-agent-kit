#!/usr/bin/env bash
# Build and launch the Liquid Glass showcase. Pass `release` for an
# optimized run.
#
#   ./scripts/run.sh             # debug
#   ./scripts/run.sh release     # -c release

set -euo pipefail

cd "$(dirname "$0")/.."

mode="${1:-debug}"
case "$mode" in
  debug)
    swift run LiquidGlassShowcase
    ;;
  release)
    swift run -c release LiquidGlassShowcase
    ;;
  *)
    echo "usage: $0 [debug|release]" >&2
    exit 2
    ;;
esac
