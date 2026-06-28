import { API_ROUTES } from "@/api";
import api from "@/axios/axios.v1";
import { Module } from "@global-types/entities/file.entity-type";
import { IPostSaveFileResponse } from "@global-types/responses/file.response";
export const saveFile = async (payload: {
    file: File;
    module: Module;
}): Promise<IPostSaveFileResponse> => {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("module", payload.module);

    const response = await api.post<IPostSaveFileResponse>(
        API_ROUTES.FILE.SAVE,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response;
};
