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

# Compile Metal shaders into a default.metallib and place it inside the
# SwiftPM-built resource bundle. SwiftPM does NOT invoke the Metal compiler
# during `swift build` / `swift run` — it copies .metal files as raw
# resources. Without this step, ShaderLibrary.bundle(.module) finds no
# functions and `.layerEffect` renders transparent surfaces. The fix is to
# call `xcrun metal` + `xcrun metallib` ourselves and drop the artifact in
# the same Bundle.module location SwiftUI looks for it.
arch=$(uname -m)
build_dir=".build/${arch}-apple-macosx/${mode}"
bundle="${build_dir}/LiquidGlassShowcase_LiquidGlassShowcase.bundle"
shader_src="Sources/LiquidGlassShowcase/Shaders.metal"

if [ -f "${shader_src}" ] && [ -d "${bundle}" ]; then
  echo "compiling ${shader_src} → ${bundle}/default.metallib"
  air="${build_dir}/Shaders.air"
  xcrun -sdk macosx metal    -c "${shader_src}" -o "${air}"
  xcrun -sdk macosx metallib    "${air}"        -o "${bundle}/default.metallib"
  rm -f "${air}"
fi
