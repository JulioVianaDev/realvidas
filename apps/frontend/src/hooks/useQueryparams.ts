import {
    useRouter,
    useSearch,
    useNavigate,
} from "@tanstack/react-router";

export default function useQueryParams() {
    const navigate = useNavigate();
    const currentSearch = useSearch({ strict: false });
    const router = useRouter();

    const searchParams = new URLSearchParams();

    Object.entries(currentSearch).forEach(([key, value]) => {
        if (typeof value === "string") {
            searchParams.set(key, value);
        }
    });

    const save = (newParams: { [key: string]: string }) => {
        const updatedSearch = {
            ...currentSearch,
            ...newParams,
        };

        navigate({
            // @ts-ignore
            search: updatedSearch,
        });
    };

    return {
        search: searchParams,
        save,
    };
}
