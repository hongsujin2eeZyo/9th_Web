import { api } from "./axiosInstance";

export const postImage = async (file: File | Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/v1/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.imageUrl;
};
