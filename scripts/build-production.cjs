#!/usr/bin/env node
/**
 * Production build for the realvidas monorepo.
 *
 * Order:
 *  1. @realvidas/types
 *  2. @realvidas/email-templates
 *  3. @realvidas/backend, @realvidas/frontend (parallel)
 *
 * Whatsmeow is NOT built here — it compiles inside Docker (see `npm run build:meow`).
 *
 * Sets VITE_APP_VERSION from version.json when not already in the environment.
 */
const { execSync } = require("child_process");
const { readFileSync, existsSync } = require("fs");
const { resolve } = require("path");

const root = resolve(__dirname, "..");

function readVersion() {
    try {
        const raw = readFileSync(
            resolve(root, "version.json"),
            "utf8",
        );
        return JSON.parse(raw).version || "0.0.0";
    } catch {
        return "0.0.0";
    }
}

function run(command, label) {
    console.log(`\n▶ ${label}\n`);
    execSync(command, {
        cwd: root,
        stdio: "inherit",
        env: process.env,
    });
}

function assertSharedPackageOutputs() {
    const typesEntry = resolve(root, "packages/types/dist");
    const emailEntry = resolve(
        root,
        "packages/email-templates/dist/index.js",
    );
    if (!existsSync(typesEntry)) {
        throw new Error(
            "packages/types/dist was not produced — shared types build failed.",
        );
    }
    if (!existsSync(emailEntry)) {
        throw new Error(
            "packages/email-templates/dist was not produced — email-templates build failed.",
        );
    }
}

const version = process.env.VITE_APP_VERSION || readVersion();
process.env.VITE_APP_VERSION = version;

console.log(`realvidas production build (app version: ${version})`);

run("npx nx run @realvidas/types:build", "Build @realvidas/types");

run(
    "npx nx run @realvidas/email-templates:build",
    "Build @realvidas/email-templates",
);

assertSharedPackageOutputs();

run(
    "npx nx run-many -t build --projects=@realvidas/backend,@realvidas/frontend --parallel=2",
    "Build backend and frontend",
);

console.log("\n✓ Production build finished successfully.\n");
console.log("Artifacts:");
console.log("  - packages/types/dist");
console.log("  - packages/email-templates/dist");
console.log("  - apps/backend/dist");
console.log("  - apps/frontend/build");
console.log(
    "\nWhatsmeow: run `npm run build:meow` (Docker build on this machine).\n",
);
