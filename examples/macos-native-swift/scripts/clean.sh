#!/usr/bin/env bash
# Wipe build artifacts.

set -euo pipefail

cd "$(dirname "$0")/.."

swift package clean
rm -rf .build
