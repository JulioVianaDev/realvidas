import * as React from "react";
import { useUserStore } from "@/zustand/user.store";
import {
    useAdminListTenantsQuery,
    useGetEnterprisesByTenantQuery,
    useGetMyEnterprisesQuery,
} from "@/hooks/query/enterprise/enterprise.query";
import { usePatchMyCurrentTenantMutation } from "@/hooks/query/user/user.query";

export type EnterpriseSelectOption = { id: string; name: string };

/**
 * Resolves the same enterprise list as the app sidebar (tenant + role aware).
 */
export function useEnterprisesForSelect() {
    const user = useUserStore((s) => s.userAuth);
    const userData = useUserStore((s) => s.user);
    const isAdmin = user?.role === "ADMIN";

    const { data: adminTenants = [] } = useAdminListTenantsQuery(isAdmin);
    const [selectedTenantId, setSelectedTenantId] = React.useState<
        string | null
    >(() => localStorage.getItem("selected-tenant-id") || null);

    const { mutate: patchMyCurrentTenant } =
        usePatchMyCurrentTenantMutation();

    const adminDefaultTenantPatchSentRef = React.useRef(false);

    React.useEffect(() => {
        if (!user) {
            adminDefaultTenantPatchSentRef.current = false;
            return;
        }

        if (!isAdmin) {
            const tenantIdFromUser =
                userData?.currentTenantViewId || null;
            setSelectedTenantId(tenantIdFromUser);
            if (tenantIdFromUser) {
                localStorage.setItem(
                    "selected-tenant-id",
                    tenantIdFromUser,
                );
            }
            return;
        }

        if (userData?.currentTenantViewId) {
            adminDefaultTenantPatchSentRef.current = false;
            setSelectedTenantId(userData.currentTenantViewId);
            localStorage.setItem(
                "selected-tenant-id",
                userData.currentTenantViewId,
            );
            return;
        }

        const firstTenantId = adminTenants[0]?.id;
        if (!firstTenantId) {
            return;
        }

        setSelectedTenantId(firstTenantId);
        localStorage.setItem("selected-tenant-id", firstTenantId);

        if (adminDefaultTenantPatchSentRef.current) {
            return;
        }
        adminDefaultTenantPatchSentRef.current = true;
        patchMyCurrentTenant(
            { tenantId: firstTenantId },
            {
                onError: () => {
                    adminDefaultTenantPatchSentRef.current = false;
                },
            },
        );
    }, [
        user,
        isAdmin,
        userData?.currentTenantViewId,
        adminTenants,
        patchMyCurrentTenant,
    ]);

    const { data: adminTenantEnterprises = [], isLoading: loadingAdmin } =
        useGetEnterprisesByTenantQuery(
            selectedTenantId,
            isAdmin && !!selectedTenantId,
        );

    const { data: myEnterprisesResponse, isLoading: loadingMy } =
        useGetMyEnterprisesQuery(
            { page: 1, pageSize: 100, includeInactive: false },
            !isAdmin && !!selectedTenantId,
        );

    const enterprises = React.useMemo((): EnterpriseSelectOption[] => {
        if (isAdmin) return adminTenantEnterprises;
        return (myEnterprisesResponse?.data || []).map((e) => ({
            id: e.id,
            name: e.name,
        }));
    }, [adminTenantEnterprises, isAdmin, myEnterprisesResponse?.data]);

    const isLoading =
        !selectedTenantId ||
        (isAdmin ? loadingAdmin : loadingMy);

    return {
        enterprises,
        isLoading: !!isLoading,
        selectedTenantId,
    };
}
