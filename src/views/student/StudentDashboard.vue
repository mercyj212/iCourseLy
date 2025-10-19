<template>
  <div class="min-h-screen bg-[#0B0B0F] text-white font-poppins">


    <!-- Dashboard Content -->
    <main class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div class="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-[#14161A] p-4 rounded-xl border border-gray-800">
          <p class="text-gray-400 text-sm">Courses</p>
          <h2 class="text-2xl font-semibold">{{ dashboard.totalCourses }}</h2>
        </div>
        <div class="bg-[#14161A] p-4 rounded-xl border border-gray-800">
          <p class="text-gray-400 text-sm">Completed Lessons</p>
          <h2 class="text-2xl font-semibold">{{ dashboard.completedLessons }}</h2>
        </div>
        <div class="bg-[#14161A] p-4 rounded-xl border border-gray-800">
          <p class="text-gray-400 text-sm">Points</p>
          <h2 class="text-2xl font-semibold">{{ dashboard.totalPoints }}</h2>
        </div>
        <div class="bg-[#14161A] p-4 rounded-xl border border-gray-800">
          <p class="text-gray-400 text-sm">🔥 Streak Days</p>
          <h2 class="text-2xl font-semibold">{{ dashboard.streakDays }}</h2>
        </div>
      </div>

      <!-- Recent Courses -->
      <section class="col-span-3 lg:col-span-2">
        <h3 class="text-lg font-semibold mb-3">Recent Courses</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="course in dashboard.recentCourses"
            :key="course.id"
            class="bg-[#14161A] rounded-xl p-4 border border-gray-800 hover:border-yellow-400/30 cursor-pointer"
          >
            <img :src="course.cover" class="w-full h-32 object-cover rounded-lg mb-3" />
            <h4 class="font-semibold text-white">{{ course.title }}</h4>
            <p class="text-sm text-gray-400">Progress: {{ course.progress }}%</p>
          </div>
        </div>
      </section>

      <!-- Recommended -->
      <section class="col-span-3 lg:col-span-1">
        <h3 class="text-lg font-semibold mb-3">Recommended For You</h3>
        <div
          v-for="rec in dashboard.recommended"
          :key="rec._id"
          class="bg-[#14161A] p-4 rounded-xl mb-3 border border-gray-800 hover:border-yellow-400/30"
        >
          <h4 class="font-semibold text-white">{{ rec.title }}</h4>
          <p class="text-sm text-gray-400">Instructor: {{ rec.instructor?.name || 'Unknown' }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getStudentDashboard } from "@/services/student.js";

const student = ref(JSON.parse(localStorage.getItem("user")) || {});
const dashboard = ref({});

onMounted(async () => {
  try {
    const { data } = await getStudentDashboard(student.value._id);
    dashboard.value = data;
  } catch (err) {
    console.error("Error fetching dashboard:", err);
  }
  });
</script>
