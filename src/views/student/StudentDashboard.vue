<template>
  
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-[#1B1B1B] rounded-lg p-6 flex flex-col items-center">
        <div class="text-3xl font-bold text-yellow-400">{{ totalCourses }}</div>
        <div class="text-gray-400 mt-2">Total Courses</div>
      </div>
      <div class="bg-[#1B1B1B] rounded-lg p-6 flex flex-col items-center">
        <div class="text-3xl font-bold text-green-400">{{ completedCourses }}</div>
        <div class="text-gray-400 mt-2">Completed</div>
      </div>
      <div class="bg-[#1B1B1B] rounded-lg p-6 flex flex-col items-center">
        <div class="text-3xl font-bold text-purple-400">{{ inProgressCourses }}</div>
        <div class="text-gray-400 mt-2">In Progress</div>
      </div>
    </div>

    <!-- Recent Courses -->
    <section class="mt-8">
      <h2 class="text-xl font-semibold text-[#E0B4B2] mb-4">Recent Courses</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in recentCourses"
          :key="course.id"
          class="bg-[#1B1B1B] rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
        >
          <img
            :src="course.cover"
            alt="Course Cover"
            class="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 class="text-lg font-semibold">{{ course.title }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ course.instructor }}</p>
          <div class="mt-2 bg-gray-700 h-2 rounded-full">
            <div
              class="h-2 rounded-full bg-yellow-400"
              :style="{ width: course.progress + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">{{ course.progress }}% completed</p>
        </div>
      </div>
    </section>

    <!-- Recommended Courses -->
    <section class="mt-8">
      <h2 class="text-xl font-semibold text-[#E0B4B2] mb-4">Recommended Courses</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in recommendedCourses"
          :key="course.id"
          class="bg-[#1B1B1B] rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
        >
          <img
            :src="course.cover"
            alt="Course Cover"
            class="w-full h-32 object-cover rounded-md mb-4"
          />
          <h3 class="text-lg font-semibold">{{ course.title }}</h3>
          <p class="text-sm text-gray-400 mt-1">{{ course.instructor }}</p>
        </div>
      </div>
    </section>
  
</template>

<script setup>
import { ref } from "vue";


// Quick stats
const totalCourses = ref(12);
const completedCourses = ref(5);
const inProgressCourses = ref(7);

// Dummy recent courses
const recentCourses = ref([
  { id: 1, title: "Vue.js Mastery", instructor: "Jane Doe", cover: "/course1.jpg", progress: 80 },
  { id: 2, title: "Advanced JavaScript", instructor: "John Smith", cover: "/course2.jpg", progress: 45 },
  { id: 3, title: "HTML & CSS Basics", instructor: "Alice Brown", cover: "/course3.jpg", progress: 100 },
]);

// Dummy recommended courses
const recommendedCourses = ref([
  { id: 4, title: "React for Beginners", instructor: "Bob Martin", cover: "/course4.jpg" },
  { id: 5, title: "Node.js Essentials", instructor: "Sarah Lee", cover: "/course5.jpg" },
  { id: 6, title: "Tailwind CSS Crash Course", instructor: "David Kim", cover: "/course6.jpg" },
]);
</script>

<style scoped>
/* Optional: scroll bar styling for the course lists */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}
</style>
