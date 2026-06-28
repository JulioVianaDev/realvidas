export const API_ROUTES = {
    // ... existing code ...
    CONTENT: {
        GET: "/v1/content",
        GET_BY_ID: (id: string) => `/v1/content/${id}`,
        CREATE: "/v1/content",
        EDIT: (id: string) => `/v1/content/${id}`,
        DELETE: (id: string) => `/v1/content/${id}`,
    },
    USERS: {
        GET: "/v1/users",
        GET_BY_ID: (id: number) => `/v1/users/${id}`,
        CREATE: "/v1/users/create",
        EDIT: (id: number) => `/v1/users/edit/${id}`,
        DELETE: (id: number) => `/v1/users/delete/${id}`,
        IMPORT_FILE: "/v1/users/import-by-file",
        RESET_PASSWORD: (id: number) =>
            `/v1/users/reset-password/${id}`,
    },
    // ... existing code ...
};
