import api from "./api";

export const updateCourse = (id, courseData) => api.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const createCourse = (courseData) => api.post("/courses", courseData);
export const getMyCourses = () => api.post("/courses/my-courses");

export const createLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons`, data);
export const updateLesson = (lessonId, data) => api.post(`/lessons/${lessonId}/lessons`, data);
export const deleteLesson = (lessonId) => api.delete(`/lessons/${lessonId}/lessons`);