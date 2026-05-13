#!/bin/bash
set -e

echo "=== Local CI ==="

./scripts/lint.sh
./scripts/test.sh
./scripts/verify.sh

echo "=== Local CI Passed ==="
