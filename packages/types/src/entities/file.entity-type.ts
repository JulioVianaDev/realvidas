export type Module =
    | "user"
    | "enterprise"
    | "answers"
    | "chat"
    | "assistant"
    | "product"
    | "combo"
    | "catalog"
    | "campaign";

export interface IFileEntity {
    id: string;
    createdAt: string;
    deletedAt: string | null;
    hash: string;
    extension: string;
    originalName: string;
    module: Module;
    userId?: string;
    isReceived: boolean;
    fileSize: number;
    type: "image" | "document" | "video" | "audio";
}
