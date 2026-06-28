import {
    createFileRoute,
    Outlet,
    redirect,
} from "@tanstack/react-router";
import { useUserStore } from "@/zustand/user.store";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Navbar from "@/components/navbar";
import { useGetUserById, ensureUserByIdQueryConfig } from "@/hooks/query/user/user.query";
import useSocketNest from "@/api/useSocketNest";
import { useTranslation } from "@/contexts/TranslationsContext";

export const Route = createFileRoute("/_authenticated")({
    component: AuthenticatedLayout,
    beforeLoad: async ({ context, location }) => {
        const { userAuth } = useUserStore.getState();

        const redirectTarget = `${location.pathname}${location.searchStr ?? ""}`;

        if (!userAuth) {
            throw redirect({
                to: "/login",
                search: {
                    redirect: redirectTarget,
                },
            });
        }
        if (userAuth.emailConfirmed === false) {
            throw redirect({
                to: "/verify-email",
                search: { redirect: redirectTarget },
            });
        }

        const user = await context.queryClient.ensureQueryData(
            ensureUserByIdQueryConfig(userAuth.id),
        );

        if (user) {
            useUserStore.getState().setUser(user);
        }

        return {
            hasTenantMembership: user?.hasTenantMembership === true,
        };
    },
});

function AuthenticatedLayout() {
    const { t } = useTranslation();
    const { userAuth } = useUserStore();
    const { hasTenantMembership } = Route.useRouteContext();
    const canSeeSidebar =
        hasTenantMembership || userAuth?.role === "ADMIN";

    useGetUserById(userAuth?.id);
    useSocketNest();

    if (!userAuth) {
        return null;
    }

    return (
        <SidebarProvider>
            {canSeeSidebar ? <AppSidebar /> : null}
            <main className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
                <div className="shrink-0">
                    <Navbar />
                </div>
                <div className="flex-1 min-h-[calc(100vh-10rem)]">
                    <Outlet />
                </div>
                <footer className="flex h-16 w-full items-center justify-center border-t-2 border-primary">
                    <p>{t("layout.footerCopyright")}</p>
                </footer>
            </main>
        </SidebarProvider>
    );
}
