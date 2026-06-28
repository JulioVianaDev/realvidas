export interface IGetAllCampaignsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}

export interface IGetCampaignByIdParams {
    id: string;
}

export interface IGetCampaignRecipientsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
}

export interface ICampaignEnterpriseQueryParams {
    enterpriseId: string;
}
