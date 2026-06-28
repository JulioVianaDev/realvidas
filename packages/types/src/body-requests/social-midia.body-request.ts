import { SocialMediaTypeEnum } from "../entities/social-midia.entity-type";

export interface IPostCreateSocialMidiaBodyRequest {
    enterpriseId: string;
    name: string;
    type: SocialMediaTypeEnum;
    isActive?: boolean;
    connected?: boolean;
    key?: string | null;
    token?: string | null;
    /** Default assistant (UUID) for AI-mode conversations on this channel. */
    aiId?: string | null;
    metadata?: string;
}

export interface IPutUpdateSocialMidiaBodyRequest {
    name?: string;
    type?: SocialMediaTypeEnum;
    isActive?: boolean;
    connected?: boolean;
    key?: string | null;
    token?: string | null;
    aiId?: string | null;
    metadata?: string;
}
