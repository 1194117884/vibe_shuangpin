#!/bin/bash
set -e

echo "--- Lint ---"
npx eslint src/ --ext .ts,.tsx --max-warnings 0
