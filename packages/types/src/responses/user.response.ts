import { UserTypeReturn } from "../entities/user.entity-type";

/** After PATCH me/ui-preferences */
export type IPatchUserUiPreferencesResponse = Pick<
    UserTypeReturn,
    "id" | "language" | "theme"
>;
export interface GetUsersResponse {
    data: UserTypeReturn[];
    metadata: {
        page: number;
        search: string;
        hasNextPage: boolean;
        total: number;
        hasPreviousPage: boolean;
    };
}

export type UpdateOrCreateUserResponse = UserTypeReturn;

export type GetUserByIdResponse = UserTypeReturn | null;
