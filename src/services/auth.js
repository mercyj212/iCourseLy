import api from "./api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");
export const verifyEmail = (email) => api.get("/auth/verify-email", {email});
export const resendVerification = (email) => api.post("/auth/resend-verification", {email});
export const forgotPassword = (email) => api.post("/auth/forgot-password", email);
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, {password});
export const refreshToken = () => api.post("/auth/refresh-token");