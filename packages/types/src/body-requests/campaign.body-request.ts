import { ICampaignEntity } from "../entities/campaign.entity-type";

export interface IPostCreateCampaignBodyRequest {
    enterpriseId: string;
    socialMidiaId: number;
    assistantId?: string | null;
    name: string;
    description?: string | null;
    messageBody: string;
    followUpPrompt?: string | null;
}

export interface IPutUpdateCampaignBodyRequest {
    name?: ICampaignEntity["name"];
    description?: ICampaignEntity["description"];
    messageBody?: ICampaignEntity["messageBody"];
    followUpPrompt?: ICampaignEntity["followUpPrompt"];
    assistantId?: ICampaignEntity["assistantId"];
}
