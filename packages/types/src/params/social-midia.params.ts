import { SocialMediaTypeEnum } from "../entities/social-midia.entity-type";

export interface IGetAllSocialMidiasParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    type?: SocialMediaTypeEnum;
    isActive?: boolean;
    connected?: boolean;
}

export interface IGetSocialMidiaByIdParams {
    id: number;
}

export interface ISocialMidiaEnterpriseQueryParams {
    enterpriseId: string;
}

export interface IGetSocialMidiaQrCodeParams
  extends ISocialMidiaEnterpriseQueryParams {
  /** When true: disconnect → delete → create → connect before fetching QR. */
  retry?: boolean;
}
