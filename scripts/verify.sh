#!/bin/bash
set -e

echo "=== Verification ==="

echo "--- Lint ---"
npm run lint || exit 1

echo "--- TypeCheck ---"
npm run typecheck || exit 1

echo "--- Test ---"
npm run test || exit 1

echo "--- Build ---"
npm run build || exit 1

echo "=== All checks passed ==="
