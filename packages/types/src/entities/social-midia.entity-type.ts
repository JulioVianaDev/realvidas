/**
 * Runtime map of allowed `type` values — keep in sync with backend
 * `SocialMediaType` and Postgres `social_media_type_enum`.
 */
export const SOCIAL_MEDIA_TYPE = {
    WHATSAPP_realvidas: "WHATSAPP_realvidas",
} as const;

export type SocialMediaTypeEnum =
    (typeof SOCIAL_MEDIA_TYPE)[keyof typeof SOCIAL_MEDIA_TYPE];

export interface ISocialMidiaEntity {
    id: number;
    /** Canonical tenant id (`public.tenants.id`); null only on template / legacy rows. */
    tenantId: string | null;
    enterpriseId: string;
    name: string;
    type: SocialMediaTypeEnum;
    isActive: boolean;
    connected: boolean;
    key: string | null;
    token: string | null;
    /** Default assistant for AI-mode realvidas conversations. */
    aiId: string | null;
    metadata: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
