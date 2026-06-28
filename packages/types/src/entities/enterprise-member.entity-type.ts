// Enterprise Member Entity Types

export type EnterpriseRoleType =
    | "OWNER"
    | "ADMIN"
    | "MANAGER"
    | "EMPLOYEE"
    | "SELLER"; 

export const EnterpriseRoleValues: {
    OWNER: "OWNER";
    ADMIN: "ADMIN";
    MANAGER: "MANAGER";
    EMPLOYEE: "EMPLOYEE";
    SELLER: "SELLER";
    VIEWER: "VIEWER";
} = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    EMPLOYEE: "EMPLOYEE",
    SELLER: "SELLER",
    VIEWER: "VIEWER",
};

export interface IEnterpriseMemberEntity {
    id: string;
    enterpriseId: string;
    userId: string;
    role: EnterpriseRoleType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Member with user info
export interface IEnterpriseMemberWithUser extends IEnterpriseMemberEntity {
    user: {
        id: string;
        name: string;
        email: string;
        imageUrl: string | null;
        cpf: string | null;
    };
}

// Member with enterprise info
export interface IEnterpriseMemberWithEnterprise extends IEnterpriseMemberEntity {
    enterprise: {
        id: string;
        name: string;
        slug: string;
        imageUrl: string | null;
    };
}

// Full member info
export interface IEnterpriseMemberFull extends IEnterpriseMemberEntity {
    user: {
        id: string;
        name: string;
        email: string;
        imageUrl: string | null;
        cpf: string | null;
    };
}

