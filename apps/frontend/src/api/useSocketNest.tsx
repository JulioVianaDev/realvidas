import { useSocketV1 } from "./socket";
import { useAuthTenantSocketSync } from "@/hooks/query/auth/auth.query";

export default function useSocketNest() {
    useAuthTenantSocketSync();

    useSocketV1(
        "test",
        async (event: any) => {
            console.log("socket event [test]:", event);
        },
        [],
        "authenticated",
    );

    useSocketV1(
        "authenticated",
        async (data: { userId: string; rooms: string[] }) => {
            console.log("Socket authenticated with rooms:", data.rooms);
        },
        [],
        "authenticated",
    );

    useSocketV1(
        "error",
        async (error: any) => {
            console.error("Socket connection error:", error);
            if (
                error.message === "User not found" ||
                error.message === "Invalid token"
            ) {
                console.log(
                    "Redirecting to login due to authentication failure",
                );
            }
        },
        [],
        "authenticated",
    );

    return <></>;
}
