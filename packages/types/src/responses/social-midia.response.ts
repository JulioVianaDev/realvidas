import { Paginate } from "../helpers/paginate";
import { ISocialMidiaEntity } from "../entities/social-midia.entity-type";

export type IGetAllSocialMidiasResponse = Paginate<ISocialMidiaEntity>;

export type IGetSocialMidiaByIdResponse = ISocialMidiaEntity | null;

export type IPostCreateSocialMidiaResponse = ISocialMidiaEntity;

export type IPutUpdateSocialMidiaResponse = ISocialMidiaEntity;

export interface IDeleteSocialMidiaResponse {
    success: boolean;
    id: number;
}

/** GET `social-midias/:id/social-media-qr-code` — Meow pairing payload for the settings list. */
export interface IGetSocialMidiaQrCodeResponse {
    connected: boolean;
    /** PNG data URL when `connected` is false and Meow returned a QR image */
    value: string | null;
    /** Present when Meow timed out before emitting a QR string */
    message?: string;
}
