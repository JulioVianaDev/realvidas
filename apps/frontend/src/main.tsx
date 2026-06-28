import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { TranslationProvider } from "./contexts/TranslationsContext";
import { SocketInitializer } from "./components/SocketInitializer";

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    context: {
        queryClient,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <ThemeProvider
                defaultTheme="dark"
                attribute="class"
                storageKey="vite-ui-theme" enableSystem
            >
                <TranslationProvider>
                    <GoogleOAuthProvider
                        clientId={
                            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
                            "COLOQUE SEU ID"
                        }
                    >
                        <QueryClientProvider client={queryClient}>
                            <SocketInitializer />
                            <RouterProvider router={router} />
                            <Toaster />
                        </QueryClientProvider>
                    </GoogleOAuthProvider>
                </TranslationProvider>
            </ThemeProvider>
        </StrictMode>,
    );
}
