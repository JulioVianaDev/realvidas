import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/zustand/user.store";

export const Route = createFileRoute("/_public")({
    component: PublicLayout,
    beforeLoad: ({ location }) => {
        const { userAuth } = useUserStore.getState();
        
        const redirectPaths = ["/", "/login", "/register"];
        if (userAuth && redirectPaths.some((path) => location.pathname === path)) {
            if (userAuth.emailConfirmed === false) {
                throw redirect({
                    to: "/verify-email",
                    search: { redirect: "/inicio" },
                });
            }
            throw redirect({
                to: "/inicio",
            });
        }
    },
});

function PublicLayout() {
    return <Outlet />;
}
