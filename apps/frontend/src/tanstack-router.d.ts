import "@tanstack/react-router";

declare module "@tanstack/react-router" {
    interface RouteContext {
        hideLayout?: boolean;
    }
}
