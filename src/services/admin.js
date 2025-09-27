import api from "./api";

export const getAllUsers = () => api.get("/admin/users");
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAllCoursesAdmin = () => api.get("/admin/courses");
export const deleteCourseAdmin = (id) => api.delete(`/admin/courses/${id}`);
export const approveCourse = (id) => api.put(`/admin/courses/${id}/approve`);
export const getAnalytics = () => api.get("/admin/analytics");