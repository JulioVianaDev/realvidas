import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import {
    IResolvedShortPath,
    IShortPathAvailabilityResponse,
} from "@global-types/entities/url-shortener.entity-type";

export const resolveShortPathAction = async (
    shortPath: string,
): Promise<IResolvedShortPath> => {
    return await api.get<IResolvedShortPath>(
        API_ROUTES.PUBLIC.RESOLVE_SHORT_PATH(shortPath),
    );
};

export const checkShortPathAvailabilityAction = async (
    path: string,
    excludeEnterpriseId?: string,
): Promise<IShortPathAvailabilityResponse> => {
    return await api.get<IShortPathAvailabilityResponse>(
        API_ROUTES.ENTERPRISE.CHECK_SHORT_PATH,
        {
            params: excludeEnterpriseId
                ? { path, excludeEnterpriseId }
                : { path },
        },
    );
};
