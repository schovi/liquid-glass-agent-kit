#!/usr/bin/env bash
# Open the package in Xcode.

set -euo pipefail

cd "$(dirname "$0")/.."

exec xed Package.swift
