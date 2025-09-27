import api from "./api";

export const getAllCourses = () => api.get("/courses");
export const getCourseById = (id) => api.get(`/courses/${id}`);

export const enrollInCourse = (courseId) => api.post(`/enroll/${courseId}`);
export const getEnrolledCourses = (userId) => api.get(`/enroll/${userId}`);

export const getLessonByCourse = (courseId) => api.get(`/lessons/courses/${courseId}`);
export const getLessonById = (id) => api.get(`/lessons/${id}`);

export const markLessonComplete = (lessonId, courseId) => api.post(`/progress/complete`, { lessonId, courseId});
export const getLessonProgress = (lessonId) => api.get(`/progress/lesson/${lessonId}` );
export const getCourseProgress = (courseId) => api.get(`/progress/course/${courseId}`);

export const addComment = (courseId, text) => api.post("comments", { courseId, text });
export const getComments = (courseId) => api.get(`/comments/${courseId}`);