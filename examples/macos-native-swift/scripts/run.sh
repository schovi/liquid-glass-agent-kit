#!/usr/bin/env bash
# Build and launch the Liquid Glass showcase. Pass `release` for an
# optimized run.
#
#   ./scripts/run.sh             # debug
#   ./scripts/run.sh release     # -c release
#
# Delegates to build.sh (which also compiles Metal shaders, since SwiftPM
# does not invoke the Metal compiler), then execs the produced binary so
# the metallib build.sh just dropped into the bundle is loaded. `swift
# run` would re-trigger the SwiftPM resource-copy step and overwrite the
# metallib with the raw .metal source.

set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
cd "${here}/.."

mode="${1:-debug}"
case "${mode}" in
  debug)   "${here}/build.sh"          ;;
  release) "${here}/build.sh" release  ;;
  *)
    echo "usage: $0 [debug|release]" >&2
    exit 2
    ;;
esac

arch=$(uname -m)
exec ".build/${arch}-apple-macosx/${mode}/LiquidGlassShowcase"
