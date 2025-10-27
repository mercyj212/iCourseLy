import api from "./api";

// COURSE SEARCH
export const searchCourses = async (query) => {
  try {
    const { data } = await api.get(`/courses/search?q=${query}`);
    return data.results;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No results found
      return [];
    }
    console.error("Error searching courses:", error);
    throw error;
  }
};


// COURSES
export const getAllCourses = () => api.get("/courses");
export const getCourseById = (id) => api.get(`/courses/${id}`);

// ENROLLMENTS
export const enrollInCourse = (courseId) => api.post(`/enroll/${courseId}`);
export const getEnrolledCourses = (userId) => api.get(`/enroll/${userId}`);

// LESSONS
export const getLessonByCourse = (courseId) => api.get(`/lessons/courses/${courseId}`);
export const getLessonById = (id) => api.get(`/lessons/${id}`);

// PROGRESS
export const markLessonComplete = (lessonId, courseId) =>
  api.post(`/progress/complete`, { lessonId, courseId });
export const getLessonProgress = (lessonId) =>
  api.get(`/progress/lesson/${lessonId}`);
export const getCourseProgress = (courseId) =>
  api.get(`/progress/course/${courseId}`);

// COMMENTS
export const addComment = (courseId, text) =>
  api.post(`/comments`, { courseId, text }); // Added leading slash ✅
export const getComments = (courseId) => api.get(`/comments/${courseId}`);

// DASHBOARD ANALYTICS
export const getStudentDashboard = (studentId) =>
  api.get(`/student/${studentId}/dashboard`);

//  BADGES & STREAKS
export const getStudentBadges = (studentId) =>
  api.get(`/progress/${studentId}/badges`);
export const getStudentStreak = (studentId) =>
  api.get(`/progress/${studentId}/streak`);
