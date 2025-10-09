<template>
  <div class="min-h-screen p-6 lg:p-8 bg-[#0F1114] text-white font-poppins">
    <!-- HEADER -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
      <h1 class="text-2xl font-bold text-[#E0B4B2]">Analytics Dashboard</h1>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-[#111214] border border-yellow-400/10 rounded-2xl p-5 shadow hover:shadow-yellow-500/10 transition">
        <h2 class="text-gray-400 text-sm mb-1">Total Users</h2>
        <p class="text-2xl font-bold text-yellow-400">{{ analytics.totalUsers }}</p>
      </div>

      <div class="bg-[#111214] border border-yellow-400/10 rounded-2xl p-5 shadow hover:shadow-yellow-500/10 transition">
        <h2 class="text-gray-400 text-sm mb-1">Total Instructors</h2>
        <p class="text-2xl font-bold text-yellow-400">{{ analytics.totalInstructors }}</p>
      </div>

      <div class="bg-[#111214] border border-yellow-400/10 rounded-2xl p-5 shadow hover:shadow-yellow-500/10 transition">
        <h2 class="text-gray-400 text-sm mb-1">Total Courses</h2>
        <p class="text-2xl font-bold text-yellow-400">{{ analytics.totalCourses }}</p>
      </div>

      <div class="bg-[#111214] border border-yellow-400/10 rounded-2xl p-5 shadow hover:shadow-yellow-500/10 transition">
        <h2 class="text-gray-400 text-sm mb-1">Total Revenue</h2>
        <p class="text-2xl font-bold text-green-400">${{ analytics.totalRevenue }}</p>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Users Growth -->
      <div class="bg-[#111214] p-6 rounded-2xl border border-yellow-400/10 shadow">
        <h2 class="text-lg font-semibold text-[#E0B4B2] mb-4">User Growth</h2>
        <canvas id="userGrowthChart"></canvas>
      </div>

      <!-- Revenue Growth -->
      <div class="bg-[#111214] p-6 rounded-2xl border border-yellow-400/10 shadow">
        <h2 class="text-lg font-semibold text-[#E0B4B2] mb-4">Revenue Trend</h2>
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { getAnalytics } from "../../services/admin";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "AnalyticsPage",
  setup() {
    const analytics = reactive({
      totalUsers: 0,
      totalInstructors: 0,
      totalCourses: 0,
      totalRevenue: 0,
      usersGrowth: [],
      revenueGrowth: [],
    });

    const loadAnalytics = async () => {
      try {
        const { data } = await getAnalytics();
        Object.assign(analytics, data);

        // Users Growth Chart
        const userCtx = document.getElementById("userGrowthChart").getContext("2d");
        new Chart(userCtx, {
          type: "line",
          data: {
            labels: analytics.usersGrowth.map((d) => d.month),
            datasets: [
              {
                label: "Users",
                data: analytics.usersGrowth.map((d) => d.count),
                borderColor: "#FACC15",
                backgroundColor: "rgba(250, 204, 21, 0.1)",
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { labels: { color: "#fff" } },
            },
            scales: {
              x: { ticks: { color: "#aaa" } },
              y: { ticks: { color: "#aaa" } },
            },
          },
        });

        // Revenue Chart
        const revCtx = document.getElementById("revenueChart").getContext("2d");
        new Chart(revCtx, {
          type: "bar",
          data: {
            labels: analytics.revenueGrowth.map((d) => d.month),
            datasets: [
              {
                label: "Revenue ($)",
                data: analytics.revenueGrowth.map((d) => d.amount),
                backgroundColor: "rgba(34,197,94,0.5)",
                borderColor: "#22c55e",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { labels: { color: "#fff" } },
            },
            scales: {
              x: { ticks: { color: "#aaa" } },
              y: { ticks: { color: "#aaa" } },
            },
          },
        });
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    };

    onMounted(loadAnalytics);

    return { analytics };
  },
};
</script>

<style scoped>
.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>
