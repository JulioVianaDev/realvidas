import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/zustand/user.store";

/**
 * Admin-only layout (JWT role ADMIN). Child routes live under segments like `admin/plans/`
 * so URLs are `/admin/...` without colliding with `_public/plans` (`/plans`).
 */
export const Route = createFileRoute("/_authenticated/_admin")({
    component: AdminLayout,
    beforeLoad: () => {
        const { userAuth } = useUserStore.getState();
        if (!userAuth || userAuth.role !== "ADMIN") {
            throw redirect({ to: "/inicio" });
        }
    },
});

function AdminLayout() {
    return <Outlet />;
}
