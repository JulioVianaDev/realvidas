/**
 * Responses from the Go Meow / WhatsApp bridge. Align with `apps/whatsmeow` handlers.
 */

export interface IMeowErrorResponseEntity {
    error: string;
}

export type IMeowConnectInstanceResponseEntity =
    | {
          status: "qr_generated";
          instance_key: string;
          message: string;
      }
    | {
          status: "already_connected" | "already_logged_in";
          instance_key: string;
          message: string;
      }
    | {
          status: "instance_created";
          instance_key: string;
          message: string;
      };

export interface IMeowListInstancesInstanceRowEntity {
    instance_key: string;
    connected: boolean;
    logged_in: boolean;
    phone_number: string;
}

export interface IMeowListInstancesResponseEntity {
    count: number;
    instances: IMeowListInstancesInstanceRowEntity[];
}

export interface IMeowGetInstanceStatusResponseEntity {
    instance_key: string;
    connected: boolean;
    logged_in: boolean;
    phone_number: string;
}

/** Returned when instance is already connected (PNG QR endpoint short-circuit) */
export interface IMeowQrAlreadyConnectedResponseEntity {
    status: "connected";
    message: string;
}

export interface IMeowDisconnectResponseEntity {
    instance_key: string;
    message: string;
    status: "disconnected";
}

export interface IMeowDeleteInstanceResponseEntity {
    instance_key: string;
    message: string;
    status: "deleted";
}

export interface IMeowValidatePhoneResponseEntity {
    status: "success" | "error";
    original_phone: string;
    valid_phone: string;
    exists: boolean;
    message?: string;
}

export interface IMeowLidToPhoneResponseEntity {
    status: "success" | "error";
    lid: string;
    phone_number?: string;
    exists: boolean;
    message?: string;
}

export interface IMeowSimpleMessageResponseEntity {
    status: "sent";
    message_id: string;
    error?: string;
}

export type IMeowSendTextResponseEntity = IMeowSimpleMessageResponseEntity;
export type IMeowSendMediaResponseEntity = IMeowSimpleMessageResponseEntity;
export type IMeowSendVoiceResponseEntity = IMeowSimpleMessageResponseEntity;
export type IMeowSendContactResponseEntity = IMeowSimpleMessageResponseEntity;
export type IMeowSendLocationResponseEntity = IMeowSimpleMessageResponseEntity;
export type IMeowSendInteractiveResponseEntity = IMeowSimpleMessageResponseEntity;
