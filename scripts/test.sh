#!/bin/bash
set -e

echo "--- Test ---"
npx vitest run --reporter verbose
