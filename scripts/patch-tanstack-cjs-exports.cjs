/**
 * NestJS compiles to CommonJS, but @tanstack/ai packages are ESM-only.
 * Add `require`/`default` export conditions so Node can load them at runtime.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "node_modules", "@tanstack");

function patchExports(exportsField) {
    if (typeof exportsField === "string") {
        return {
            types: exportsField.replace(/\.js$/, ".d.ts"),
            import: exportsField,
            require: exportsField,
            default: exportsField,
        };
    }

    if (!exportsField || typeof exportsField !== "object") {
        return exportsField;
    }

    const patched = { ...exportsField };

    if (patched.import && !patched.require) {
        patched.require = patched.import;
    }
    if (patched.import && !patched.default) {
        patched.default = patched.import;
    }

    for (const [key, value] of Object.entries(patched)) {
        if (key === "import" || key === "require" || key === "types" || key === "default") {
            continue;
        }
        patched[key] = patchExports(value);
    }

    return patched;
}

function patchPackage(packageDir) {
    const packageJsonPath = path.join(packageDir, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return false;
    }

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    if (!pkg.exports) {
        return false;
    }

    const nextExports = patchExports(pkg.exports);

    if (JSON.stringify(nextExports) === JSON.stringify(pkg.exports)) {
        return false;
    }

    pkg.exports = nextExports;
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
    return true;
}

if (!fs.existsSync(root)) {
    process.exit(0);
}

let patchedCount = 0;

for (const entry of fs.readdirSync(root)) {
    const packageDir = path.join(root, entry);

    if (!fs.statSync(packageDir).isDirectory()) {
        continue;
    }

    if (patchPackage(packageDir)) {
        patchedCount += 1;
    }
}

if (patchedCount > 0) {
    console.log(`Patched ${patchedCount} @tanstack package(s) for CommonJS compatibility.`);
}
