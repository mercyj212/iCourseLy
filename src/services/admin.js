import api from "./api";

// Users
export const getAllUsers = () => api.get("/admin/users");
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Courses
export const getAllCoursesAdmin = () => api.get("/admin/courses");
export const deleteCourseAdmin = (id) => api.delete(`/admin/courses/${id}`);
export const approveCourse = (id) => api.put(`/admin/courses/${id}/approve`);
export const createCourseAdmin = (data) =>
  api.post("/admin/courses", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Analytics
export const getAnalytics = () => api.get("/admin/analytics");

// Notifications
export const getNotifications = () => api.get("/admin/notifications");
export const markNotificationsRead = () => api.post("/admin/notifications/read");