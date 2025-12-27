#!/usr/bin/env bash

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") - dummy change" >> "dummy.md"

git add "dummy.md"

git commit -m "refactor: dummy change"
