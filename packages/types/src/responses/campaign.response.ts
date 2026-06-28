import { Paginate } from "../helpers/paginate";
import {
    ICampaignEntity,
    ICampaignRecipientEntity,
    ICampaignRecipientStatus,
    ICampaignStatus,
} from "../entities/campaign.entity-type";

export type IGetAllCampaignsResponse = Paginate<ICampaignEntity>;

export type IGetCampaignByIdResponse = ICampaignEntity | null;

export type IPostCreateCampaignResponse = ICampaignEntity;

export interface ICampaignReportStats {
    total: number;
    pending: number;
    queued: number;
    sent: number;
    delivered: number;
    read: number;
    responded: number;
    failed: number;
    percentSent: number;
    percentDelivered: number;
    percentRead: number;
    percentResponded: number;
}

export interface ICampaignRecipientReportRow
    extends ICampaignRecipientEntity {
    customerName: string | null;
}

export type IGetCampaignRecipientsResponse =
    Paginate<ICampaignRecipientReportRow>;

export interface IGetCampaignReportResponse {
    campaign: ICampaignEntity;
    stats: ICampaignReportStats;
}

export interface IGetCampaignCsvTemplateResponse {
    filename: string;
    content: string;
    contentType: string;
}

export type ICampaignStatusType = ICampaignStatus;
export type ICampaignRecipientStatusType = ICampaignRecipientStatus;
