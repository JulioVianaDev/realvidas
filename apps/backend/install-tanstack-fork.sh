#!/bin/bash
# ============================================================
# install-tanstack-fork.sh
# Installs TanStack AI packages from a GitHub fork branch.
#
# Usage:
#   bash install-tanstack-fork.sh
#
# Once the PR is merged upstream, just run:
#   npm install @tanstack/ai@latest @tanstack/ai-anthropic@latest ...
# to switch back to the official npm versions.
# ============================================================

set -e

REPO_URL="https://github.com/JulioVianaDev/tanstack-ai.git"
BRANCH="feat/expose-cached-tokens-in-usage"
CLONE_DIR=".tanstack-fork-build"

echo "==> Cleaning previous build..."
rm -rf "$CLONE_DIR"

echo "==> Cloning $REPO_URL (branch: $BRANCH)..."
git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$CLONE_DIR"

echo "==> Installing dependencies..."
cd "$CLONE_DIR"
corepack enable
pnpm install --frozen-lockfile

echo "==> Building all packages..."
pnpm build:all

echo "==> Packing all packages..."
mkdir -p _tarballs

for pkg in packages/*/; do
  if [ -f "$pkg/package.json" ]; then
    private=$(node -e "console.log(require('./$pkg/package.json').private || false)" 2>/dev/null)
    if [ "$private" != "true" ]; then
      (cd "$pkg" && pnpm pack --pack-destination ../../_tarballs) > /dev/null 2>&1
    fi
  fi
done

TARBALLS_ABS="$(pwd)/_tarballs"
echo "==> Packed $(ls _tarballs/*.tgz | wc -l) packages"

cd ..

echo "==> Moving tarballs to persistent location..."
PERSISTENT_DIR=".tanstack-fork-tarballs"
rm -rf "$PERSISTENT_DIR"
mv "$CLONE_DIR/_tarballs" "$PERSISTENT_DIR"

echo "==> Cleaning up clone (keeping tarballs)..."
rm -rf "$CLONE_DIR"

echo "==> Installing tarballs into your project..."
TARBALL_ARGS=""
for tgz in "$PERSISTENT_DIR"/*.tgz; do
  TARBALL_ARGS="$TARBALL_ARGS $tgz"
done

npm install --legacy-peer-deps $TARBALL_ARGS

echo ""
echo "Done! All TanStack AI fork packages installed."
echo "Tarballs kept at: $PERSISTENT_DIR/"
echo "When the PR is merged, switch back with:"
echo "  npm install @tanstack/ai@latest @tanstack/ai-anthropic@latest ..."
