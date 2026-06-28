import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { readFileSync } from "fs";
import commonjs from "vite-plugin-commonjs";
import checker from "vite-plugin-checker";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

/** Monorepo root — Vite loads `.env*` here so `import.meta.env.VITE_*` matches root `.env`. */
const monorepoRoot = resolve(__dirname, "../../");

function getAppVersion(): string {
    try {
        const versionJson = JSON.parse(
            readFileSync(resolve(monorepoRoot, "version.json"), "utf-8"),
        );
        return versionJson.version;
    } catch {
        return "0.0.0";
    }
}

export default defineConfig(({ command }) => {
    const appVersion =
        process.env.VITE_APP_VERSION || getAppVersion();
    const isDevServer = command === "serve";

    return {
        define: {
            __APP_VERSION__: JSON.stringify(appVersion),
        },
        plugins: [
            tanstackRouter({
                target: "react",
                autoCodeSplitting: true,
                routesDirectory: "./src/pages",
                generatedRouteTree: "./src/route-tree.gen.ts",
                routeFileIgnorePrefix: "-",
                spa: {
                    enabled: true,
                },
                routeToken: "layout",
            }),
            react(),
            commonjs(),
            ...(isDevServer
                ? [
                      checker({
                          typescript: {
                              tsconfigPath: "tsconfig.app.json",
                              buildMode: false,
                          },
                          terminal: true,
                          overlay: {
                              initialIsOpen: "error",
                          },
                      }),
                  ]
                : []),
            tailwindcss(),
        ],
        envDir: monorepoRoot,
        optimizeDeps: {
            include: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "react-dom/server.browser",
            ],
        },
        build: {
            outDir: "build",
            sourcemap: false,
            chunkSizeWarningLimit: 1000,
        },
        resolve: {
            dedupe: ["react", "react-dom"],
            alias: {
                react: resolve(monorepoRoot, "node_modules/react"),
                "react-dom": resolve(monorepoRoot, "node_modules/react-dom"),
                "@": resolve(__dirname, "./src"),
                "@global-types": resolve(
                    __dirname,
                    "../../packages/types/dist",
                ),
                "@email-templates": resolve(
                    __dirname,
                    "../../packages/email-templates/src",
                ),
            },
        },
    };
});
