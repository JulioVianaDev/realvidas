const http = require("http");

const CONFIG = {
    listenPort: 4321, // port nginx proxies to (your computer)
    forwardPort: 8080, // port your actual app is running on
    forwardHost: "localhost",
};

const server = http.createServer((req, res) => {
    const timestamp = new Date().toISOString();

    console.log("\n─────────────────────────────────────────");
    console.log(`[${timestamp}]`);
    console.log(`${req.method} ${req.url}`);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));

    // Collect body
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
        if (body) {
            try {
                console.log(
                    "Body:",
                    JSON.stringify(JSON.parse(body), null, 2),
                );
            } catch {
                console.log("Body (raw):", body);
            }
        }

        // Forward to your app
        const options = {
            hostname: CONFIG.forwardHost,
            port: CONFIG.forwardPort,
            path: req.url,
            method: req.method,
            headers: {
                ...req.headers,
                host: `${CONFIG.forwardHost}:${CONFIG.forwardPort}`,
            },
        };

        const proxy = http.request(options, (proxyRes) => {
            console.log(
                `\n↩ Response from app: ${proxyRes.statusCode}`,
            );

            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxy.on("error", (err) => {
            console.error(
                `\n✗ Could not reach app on port ${CONFIG.forwardPort}:`,
                err.message,
            );
            res.writeHead(502);
            res.end(
                JSON.stringify({
                    error: "App not reachable",
                    detail: err.message,
                }),
            );
        });

        if (body) proxy.write(body);
        proxy.end();
    });
});

server.listen(CONFIG.listenPort, () => {
    console.log("╔════════════════════════════════════════╗");
    console.log("║         Webhook Forwarder              ║");
    console.log("╠════════════════════════════════════════╣");
    console.log(
        `║  Listening  → port ${CONFIG.listenPort}               ║`,
    );
    console.log(
        `║  Forwarding → port ${CONFIG.forwardPort}               ║`,
    );
    console.log("╚════════════════════════════════════════╝");
});
