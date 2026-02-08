<template>
  <div class="min-h-screen bg-white text-white font-poppins">
    <main class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- ===================== CURRENT COURSE ===================== -->
      <section class="col-span-3 lg:col-span-2">
        <div
          class="bg-gradient-to-r from-black to-transparent border border-black-400/20 rounded-2xl p-6 flex justify-between items-center"
        >
          <div>
            <p class="text-gray-400 text-sm">Currently Learning</p>
            <h2 class="text-xl font-semibold text-white mt-1">
              {{ dashboard.currentCourse?.title || 'No active course yet' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              Instructor: {{ dashboard.currentCourse?.instructor || 'Unknown' }}
            </p>
          </div>
          <button
            v-if="dashboard.currentCourse"
            class="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Continue
          </button>
        </div>
      </section>

      <!-- ===================== STATS CARDS ===================== -->
      <div class="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-black p-4 rounded-xl border border-gray-800 hover:border-yellow-400/20 transition">
          <p class="text-gray-400 text-sm font-bold">Courses</p>
          <h2 class="text-2xl font-bold transition-all duration-500">
            {{ dashboard.totalCourses }}
          </h2>
        </div>
        <div class="bg-black p-4 rounded-xl border border-gray-800 hover:border-yellow-400/20 transition">
          <p class="text-gray-400 text-sm font-bold">Completed Lessons</p>
          <h2 class="text-2xl font-bold transition-all duration-500">
            {{ dashboard.completedLessons }}
          </h2>
        </div>
        <div class="bg-black p-4 rounded-xl border border-gray-800 hover:border-yellow-400/20 transition">
          <p class="text-gray-400 text-sm font-bold">Points</p>
          <h2 class="text-2xl font-bold transition-all duration-500">
            {{ dashboard.totalPoints }}
          </h2>
        </div>
        <div class="bg-black p-4 rounded-xl border border-gray-800 hover:border-yellow-400/20 transition">
          <p class="text-gray-400 text-sm flex items-center gap-1 font-bold">🔥 Streak Days</p>
          <h2 class="text-2xl font-bold transition-all duration-500">{{ dashboard.streakDays }}</h2>

          <!-- Visual Streak -->
          <div class="flex gap-1 mt-2">
            <div
              v-for="(day, i) in 7"
              :key="i"
              class="w-3 h-3 rounded-full"
              :class="i < dashboard.streakDays ? 'bg-yellow-400' : 'bg-gray-700'"
            ></div>
          </div>
        </div>
      </div>

      <!-- ===================== RECENT COURSES ===================== -->
      <section class="col-span-3 lg:col-span-2 bg-black border rounded">
        <h3 class="text-2xl font-bold px-8 py-4 flex justify-center items-center">Recent Courses</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-4">
          <div
            v-for="course in dashboard.recentCourses"
            :key="course.id"
            class="bg-[#14161A] rounded-xl p-4 border border-gray-800 hover:border-yellow-400/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative"
          >
            <img
              :src="course.cover"
              class="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h4 class="font-semibold text-white">{{ course.title }}</h4>
            <p class="text-sm text-gray-400">{{ course.instructor }}</p>

            <!-- Progress Bar -->
            <div class="mt-3">
              <div class="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{{ course.progress }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-yellow-400 transition-all duration-700"
                  :style="{ width: course.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="flex justify-between items-center mt-3 text-xs">
              <span class="text-gray-500">{{ course.duration }}</span>
              <span class="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-lg">
                {{ course.rating }} ★
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== RIGHT SIDE ===================== -->
      <section class="col-span-3 lg:col-span-1 space-y-6">
        <!-- LEARNING GRAPH -->
        <div class="bg-[#14161A] p-4 rounded-xl border border-gray-800">
          <h4 class="font-semibold mb-2">Learning Progress</h4>
          <canvas id="learningChart" height="150"></canvas>
        </div>

        <!-- WEEKLY GOAL -->
        <div class="bg-black p-4 rounded-xl border border-gray-800">
          <h4 class="font-semibold mb-2">Weekly Goal</h4>
          <p class="text-sm text-gray-400 mb-2">Finish 2 new courses</p>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-white h-2 rounded-full transition-all duration-700"
              :style="{ width: '60%' }"
            ></div>
          </div>
        </div>

        <!-- RECOMMENDED COURSES -->
        <div>
          <h3 class="text-xl mb-3 text-black font-bold">Recommended For You</h3>
          <div
            v-for="rec in dashboard.recommended"
            :key="rec._id"
            class="bg-[#14161A] p-4 rounded-xl mb-3 border border-gray-800 hover:border-yellow-400/30 transition"
          >
            <h4 class="font-semibold text-white">{{ rec.title }}</h4>
            <p class="text-sm text-gray-400">
              Instructor: {{ rec.instructor?.name || 'Unknown' }}
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Chart from "chart.js/auto";
import { getStudentDashboard } from "@/services/student.js";

const student = ref(JSON.parse(localStorage.getItem("user")) || {});
const dashboard = ref({});
let chartInstance = null;

// ✅ Function to fetch dashboard data
async function fetchDashboard() {
  try {
    const { data } = await getStudentDashboard(student.value._id);
    dashboard.value = data;
    renderChart();
  } catch (err) {
    console.error("Error fetching dashboard:", err);
  }
}

// ✅ Render chart dynamically
function renderChart() {
  const ctx = document.getElementById("learningChart");
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy(); // destroy old chart before re-rendering

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Learning Hours",
          data: dashboard.value.learningGraph || [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#FACC15",
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: "#FACC15",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#9CA3AF" }, grid: { color: "#1F2937" } },
        y: { ticks: { color: "#9CA3AF" }, grid: { color: "#1F2937" } },
      },
    },
  });
}

// ✅ Listen for global event when student enrolls in new course
onMounted(async () => {
  await fetchDashboard();
  window.addEventListener("dashboard-updated", fetchDashboard);
});

onUnmounted(() => {
  window.removeEventListener("dashboard-updated", fetchDashboard);
});
</script>
