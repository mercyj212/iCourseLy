import api from "./api";

// Upload avatar using token from backend
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post(`/users/upload-avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/me"); // backend returns { user: {...} }
  return data;
};
