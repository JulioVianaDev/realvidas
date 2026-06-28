import { IMeowWebhookEnvelopeEntity } from "../entities/media-connection.entity-type";

/**
 * GroupMQ `lifecycle-orchestrator` job payload. `tenantId` selects the tenant schema.
 */
export type ILifecycleOrchestratorJobMessageRole =
    | "user"
    | "assistant"
    | "agent"
    | "system";

export interface ILifecycleOrchestratorJobMessage {
    role: ILifecycleOrchestratorJobMessageRole;
    body?: string;
    externalMessageId?: string;
    content?: Record<string, unknown>;
}

export interface ILifecycleOrchestratorQueuePayload {
    tenantId: string;
    instanceKey: string;
    webhook: IMeowWebhookEnvelopeEntity;
}
