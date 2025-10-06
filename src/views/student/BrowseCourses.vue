<template>
  <div class="p-10 bg-white min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-[#1A1836]">Browse Courses</h1>

    <div v-if="loading" class="text-gray-600">Loading courses...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="course in courses"
        :key="course.id"
        class="bg-[#f5f5f5] rounded-lg shadow-lg overflow-hidden hover:scale-105 transition"
      >
        <img :src="course.image" alt="Course image" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-semibold text-[#1A1836]">{{ course.title }}</h2>
          <p class="text-gray-700 text-sm mt-2 line-clamp-2">{{ course.description }}</p>

          <button
            @click="viewCourse(course)"
            class="mt-4 w-full bg-[#1A1836] text-white py-2 rounded-lg hover:bg-[#2d2b57]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BrowseCourses",
  data() {
    return {
      courses: [],
      loading: true,
    };
  },
  async mounted() {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "279a60ff8fmsh10e9ccf9e55b729p1c8b92jsne574622a0ec6",
        "X-RapidAPI-Host": "udemy-paid-courses-for-free-api.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(
        "https://udemy-paid-courses-for-free-api.p.rapidapi.com/udemy_paid_courses_data?page=1",
        options
      );
      const data = await response.json();

    
      this.courses = data.results.map((course, index) => ({
        id: course.id || index,
        title: course.title,
        description: course.description || "No description available",
        image: course.image || "https://via.placeholder.com/480x270?text=Course+Image",
        videoUrl: `https://www.youtube.com/embed/${
          ["dQw4w9WgXcQ", "L_jWHffIx5E", "3fumBcKC6RE"][index % 3]
        }`,
      }));
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    viewCourse(course) {
      this.$router.push({
        name: "CourseDetails",
        params: { id: course.id },
        query: { video: course.videoUrl },
      });
    },
  },
};
</script>
