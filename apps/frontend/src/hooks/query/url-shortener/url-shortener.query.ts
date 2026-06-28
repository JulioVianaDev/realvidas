import { useQuery } from "@tanstack/react-query";
import {
    IResolvedShortPath,
    IShortPathAvailabilityResponse,
} from "@global-types/entities/url-shortener.entity-type";
import {
    checkShortPathAvailabilityAction,
    resolveShortPathAction,
} from "@/hooks/action/url-shortener/url-shortener.action";
import { queryKeys } from "../query-keys";
import type { QueryResult } from "../query-result.types";

export const useResolveShortPathQuery = (
    shortPath: string | undefined,
): QueryResult<IResolvedShortPath> => {
    return useQuery<IResolvedShortPath>({
        queryKey: queryKeys.urlShortener.resolve(shortPath ?? ""),
        queryFn: async () => {
            if (!shortPath) throw new Error("Missing short path");
            const resolved = await resolveShortPathAction(shortPath);
            if (typeof window !== "undefined" && resolved.tenantId) {
                window.sessionStorage.setItem(
                    "publicTenantId",
                    resolved.tenantId,
                );
            }
            return resolved;
        },
        enabled: !!shortPath,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};

export const useCheckShortPathAvailabilityQuery = (
    path: string | undefined,
    excludeEnterpriseId?: string,
    enabled = true,
): QueryResult<IShortPathAvailabilityResponse> => {
    return useQuery<IShortPathAvailabilityResponse>({
        queryKey: queryKeys.urlShortener.checkAvailability(path ?? "", excludeEnterpriseId),
        queryFn: async () => {
            if (!path) return { available: false, reason: "invalid" };
            return await checkShortPathAvailabilityAction(
                path,
                excludeEnterpriseId,
            );
        },
        enabled: enabled && !!path && path.length >= 5,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
};
