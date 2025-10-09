import api from "./api";

// Users
export const getAllUsers = () => api.get("/admin/users");
export const getAllInstructors = () => api.get("/admin/instructors");
export const addInstructors = (data) => api.post("/admin/instructors", data);
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
export const markNotificationAsRead = () => api.put("/admin/notifications/read");

// Admin Profile
export const getAdminProfile = () => api.get("/admin/profile");
export const updateAdminProfile = (data) => api.put("/admin/profile", data);
export const changeAdminPassword = (data) => api.put("/admin/change-password", data);

// Upload Admin Avatar
export const uploadAdminAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return api.post("/admin/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
