// Employee Google Email Entity Types

export interface IEmployeeGoogleEmailEntity {
    id: string;
    memberId: string;
    email: string;
    
    // OAuth tokens
    refreshToken: string | null;
    accessToken: string | null;
    tokenExpiresAt: Date | null;
    
    isPrimary: boolean;
    isActive: boolean;
    
    createdAt: Date;
    updatedAt: Date;
}

// Email with member info
export interface IEmployeeGoogleEmailWithMember extends IEmployeeGoogleEmailEntity {
    member: {
        id: string;
        userId: string;
        enterpriseId: string;
        role: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    };
}

