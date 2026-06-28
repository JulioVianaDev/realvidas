import { IFileEntity } from "../entities/file.entity-type";

export type IPostSaveFileResponse = {
    entity: IFileEntity;
    url: string;
};
