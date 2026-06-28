import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export interface AppRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
    component: Root,
});

function Root() {
    // Minimal root - just render children
    // All layout logic is now in _authenticated.tsx
    // All auth checks are in _authenticated.tsx and _public.tsx
    return <Outlet />;
}
