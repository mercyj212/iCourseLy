import api from "./api";

export const searchCourses = async (query) => {
  try {
    const { data } = await api.get(`/courses/search?q=${query}`);
    return data.results;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No courses found
      return [];
    }
    console.error("Error searching courses:", error);
    throw error;
  }
};
