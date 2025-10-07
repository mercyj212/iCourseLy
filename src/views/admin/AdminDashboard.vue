<template>
  <div class="min-h-screen flex text-white font-poppins">
    <!-- SIDEBAR -->
    <aside class="w-72 bg-[#0F1114] border-r border-yellow-400/10 hidden lg:flex flex-col">
      <div class="px-6 py-6 flex items-center gap-3 border-b border-yellow-400/5">
        <img src="@/assets/iC-nobg.png" alt="iCourseLy Logo" class="w-12 h-12 object-contain transform scale-200" />
        <div>
          <div class="text-lg font-bold text-[#E0B4B2]">iCourseLy</div>
          <div class="text-xs text-gray-400">Admin Panel</div>
        </div>
      </div>

      <nav class="mt-6 px-3 flex-1 space-y-1">
        <router-link to="/admin/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition" active-class="bg-white/10 text-purple-500 font-semibold">
          <ChartBarIcon class="w-5 h-5 text-[#E0B4B2]" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/manage-courses" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition" active-class="bg-white/20 text-purple-500 font-semibold">
          <AcademicCapIcon class="w-5 h-5 text-[#E0B4B2]" />
          <span>Courses</span>
        </router-link>
        <router-link to="/admin/manage-users" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition" active-class="bg-white/20 text-purple-500 font-semibold">
          <UserGroupIcon class="w-5 h-5 text-[#E0B4B2]" />
          <span>Instructors</span>
        </router-link>
        <router-link to="/admin/manage-users" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition" active-class="bg-white/20 text-purple-500 font-semibold">
          <UserGroupIcon class="w-5 h-5 text-[#E0B4B2]" />
          <span>Students</span>
        </router-link>
        <router-link to="/admin/analytics" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition" active-class="bg-yellow-400/20 text-yellow-300 font-semibold">
          <ChartPieIcon class="w-5 h-5 text-[#E0B4B2]" />
          <span>Analytics</span>
        </router-link>
        <router-link to="/admin/settings" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition" active-class="bg-purple-400/20 text-purple-300 font-semibold">
          <Cog6ToothIcon class="w-5 h-5 text-[#E0B4B2]" />
          <span>Settings</span>
        </router-link>
      </nav>

      <div class="px-6 pb-6">
        <button @click="logout" class="w-full bg-purple-400/20 hover:bg-purple-400/20 text-purple-300 py-2 rounded-md font-semibold transition">
          Logout
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 min-h-screen">
      <!-- TOPBAR -->
      <header class="flex items-center justify-between px-6 py-4 bg-[#0F1114]/70 backdrop-blur-md border-b border-purple-400/10">
        <div class="flex items-center gap-6">
          <button class="lg:hidden p-2 rounded-md bg-[#141414] text-gray-300" @click="toggleMobileSidebar">
            <Bars3Icon class="w-6 h-6" />
          </button>

          <div>
            <h1 class="text-lg font-bold text-[#E0B4B2] tracking-wide">Hello, {{ adminName || 'Admin' }}</h1>
            <p class="text-sm text-gray-400">An Overview of your platform</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative hidden sm:block">
            <input v-model="search" placeholder="Search courses, users..." class="bg-[#111214] placeholder-gray-400 text-sm px-3 py-2 rounded-md outline-none w-64" />
          </div>

          <!-- Notification Bell -->
          <div class="relative">
            <button @click="showDropdown = !showDropdown" class="p-2 rounded-full bg-[#141414] hover:bg-[#1b1b1b] transition relative">
              <BellIcon class="w-5 h-5 text-yellow-300" />
              <span v-if="unreadCount" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {{ unreadCount }}
              </span>
            </button>

            <div v-if="showDropdown" class="absolute right-0 mt-2 w-80 bg-[#111214] border border-yellow-400/10 rounded-lg shadow-lg z-50 overflow-hidden">
              <div class="flex justify-between items-center px-4 py-2 border-b border-yellow-400/10">
                <span class="text-sm font-semibold text-[#E0B4B2]">Notifications</span>
                <button @click="markAllRead" class="text-xs text-gray-400 hover:text-yellow-300">Mark all read</button>
              </div>
              <ul class="max-h-64 overflow-y-auto">
                <li v-for="n in notifications" :key="n._id" :class="n.read ? 'bg-[#111214]' : 'bg-[#1b1b1b]'" class="px-4 py-3 border-b border-yellow-400/5">
                  <p class="text-sm">{{ n.message }}</p>
                  <p class="text-xs text-gray-400">{{ new Date(n.createdAt).toLocaleString() }}</p>
                </li>
                <li v-if="notifications.length === 0" class="px-4 py-3 text-center text-gray-500">No notifications</li>
              </ul>
            </div>
          </div>

          <!-- AVATAR UPLOAD -->
          <div class="flex items-center gap-3">
            <img
              :src="avatarUrl || defaultAvatar"
              alt="admin"
              class="w-9 h-9 rounded-full border-2 border-[#E0B4B2]/40 cursor-pointer"
              @click="selectAvatar"
            />
            <input type="file" ref="avatarInput" class="hidden" @change="onAvatarChange" accept="image/*" />
            <div class="text-right">
              <div class="text-sm font-semibold">{{ adminName || 'Admin' }}</div>
              <div class="text-xs text-gray-400">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="p-6 lg:p-8 space-y-8">
        <!-- CARDS -->
        <section>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-[#111214] rounded-2xl p-5 border border-yellow-400/6 shadow transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(224,180,178,0.2)]">
              <div class="text-xs text-gray-400">Total Users</div>
              <div class="mt-2 text-2xl font-bold text-[#E0B4B2]">{{ analytics.totalUsers }}</div>
              <div class="text-xs text-gray-400 mt-2">Active users on platform</div>
            </div>

            <div class="bg-[#111214] rounded-2xl p-5 border border-yellow-400/6 shadow transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(224,180,178,0.2)]">
              <div class="text-xs text-gray-400">Instructors</div>
              <div class="mt-2 text-2xl font-bold text-[#E0B4B2]">{{ analytics.totalInstructors }}</div>
              <div class="text-xs text-gray-400 mt-2">Approved instructors</div>
            </div>

            <div class="bg-[#111214] rounded-2xl p-5 border border-yellow-400/6 shadow transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(224,180,178,0.2)]">
              <div class="text-xs text-gray-400">Students</div>
              <div class="mt-2 text-2xl font-bold text-[#E0B4B2]">{{ analytics.totalStudents }}</div>
              <div class="text-xs text-gray-400 mt-2">Registered students</div>
            </div>

            <div class="bg-[#111214] rounded-2xl p-5 border border-yellow-400/6 shadow transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(224,180,178,0.2)]">
              <div class="text-xs text-gray-400">Courses</div>
              <div class="mt-2 text-2xl font-bold text-[#E0B4B2]">{{ analytics.totalCourses }}</div>
              <div class="text-xs text-gray-400 mt-2">Total courses</div>
            </div>
          </div>
        </section>

        <!-- CHARTS -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-[#111214] rounded-2xl p-6 border border-yellow-400/6 shadow">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-[#E0B4B2] tracking-wide">Revenue & Activity</h3>
              <div class="text-sm text-gray-400">Last 6 months</div>
            </div>
            <canvas ref="lineChart" class="w-full" height="160"></canvas>
          </div>

          <div class="bg-[#111214] rounded-2xl p-6 border border-yellow-400/6 shadow">
            <h3 class="text-lg font-semibold text-[#E0B4B2] mb-4 tracking-wide">User Distribution</h3>
            <canvas ref="doughnutChart" class="w-full" height="160"></canvas>
            <div class="mt-4 text-sm text-gray-400">Instructors vs Students</div>
          </div>
        </section>

        <!-- RECENT ACTIVITIES -->
        <section class="bg-[#111214] rounded-2xl p-6 border border-yellow-400/6 shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-[#E0B4B2] tracking-wide">Recent Activities</h3>
            <div class="text-sm text-gray-400">Latest enrollments / purchases</div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-gray-400 border-b border-yellow-400/6">
                <tr>
                  <th class="py-2">Course</th>
                  <th class="py-2">Student</th>
                  <th class="py-2">Amount</th>
                  <th class="py-2">Status</th>
                  <th class="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, idx) in recent" :key="idx" class="border-b border-yellow-400/6 hover:bg-[#151515]">
                  <td class="py-3">{{ p.courseName }}</td>
                  <td class="py-3">{{ p.student }}</td>
                  <td class="py-3">${{ p.amount }}</td>
                  <td class="py-3">
                    <span :class="p.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'" class="px-3 py-1 rounded-full text-xs">
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="py-3 text-gray-400">{{ formatDate(p.date) }}</td>
                </tr>
                <tr v-if="recent.length === 0">
                  <td colspan="5" class="py-6 text-center text-gray-500">No recent activity found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";
import socket from "@/services/socket";
import { getAnalytics, getNotifications, markNotificationAsRead, getAdminProfile, uploadAdminAvatar } from "@/services/admin";
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, Cog6ToothIcon, ChartPieIcon, BellIcon, Bars3Icon } from '@heroicons/vue/24/outline';

export default {
  name: "AdminDashboard",
  components: { ChartBarIcon, UserGroupIcon, AcademicCapIcon, Cog6ToothIcon, ChartPieIcon, BellIcon, Bars3Icon },
  setup() {
    const analytics = reactive({
      totalUsers: 0,
      totalInstructors: 0,
      totalStudents: 0,
      totalCourses: 0,
      publishedCourses: 0,
      approvedCourses: 0
    });

    const recent = ref([]);
    const lineChart = ref(null);
    const doughnutChart = ref(null);
    let lineChartInstance = null;
    let doughnutChartInstance = null;

    const currentDate = new Date().toLocaleDateString();
    const search = ref("");
    const mobileSidebar = ref(false);
    const toggleMobileSidebar = () => mobileSidebar.value = true;
    const logout = () => { localStorage.clear(); window.location.href = "/login"; };
    const formatDate = (d) => d ? new Date(d).toLocaleString() : "";
    const safeNumber = (v) => (typeof v === "number" ? v : 0);

    // Admin Profile & Avatar
    const adminName = ref("");
    const avatarUrl = ref("");
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    const avatarInput = ref(null);
    const selectAvatar = () => avatarInput.value.click();
    const onAvatarChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      avatarUrl.value = URL.createObjectURL(file);
      await uploadAvatar(file);
    };
    const uploadAvatar = async (file) => {
      try {
        const { data } = await uploadAdminAvatar(file);
        if (data.avatarUrl) avatarUrl.value = data.avatarUrl;
      } catch (err) { console.error("Failed to upload avatar", err); }
    };
    const loadAdminProfile = async () => {
      try {
        const { data } = await getAdminProfile();
        adminName.value = data.userName || "Admin";
        avatarUrl.value = data.avatar || defaultAvatar;
      } catch (err) { console.error("Failed to load admin profile", err); }
    };

    // Charts
    const setupCharts = (data) => {
      if (lineChartInstance) lineChartInstance.destroy();
      if (doughnutChartInstance) doughnutChartInstance.destroy();

      const months = data.revenueData?.months || ["Jan","Feb","Mar","Apr","May","Jun"];
      const revenueValues = data.revenueData?.values || [
        safeNumber(data.totalCourses)*10, safeNumber(data.totalCourses)*12,
        safeNumber(data.totalCourses)*9, safeNumber(data.totalCourses)*20,
        safeNumber(data.totalCourses)*16, safeNumber(data.totalCourses)*18
      ];

      const ctxLine = lineChart.value.getContext("2d");
      lineChartInstance = new Chart(ctxLine, {
        type: "line",
        data: { labels: months, datasets:[{ label:"Revenue", data:revenueValues, borderColor:"#E0B4B2", backgroundColor:"rgba(224,180,178,0.12)", tension:0.3, pointRadius:3, fill:true }] },
        options: { responsive:true, plugins:{legend:{display:false}}, scales:{x:{ticks:{color:"#cfcfcf"}, grid:{color:"rgba(255,255,255,0.03)"}}, y:{ticks:{color:"#cfcfcf"}, grid:{color:"rgba(255,255,255,0.03)"}}} }
      });

      const ctxD = doughnutChart.value.getContext("2d");
      doughnutChartInstance = new Chart(ctxD, {
        type: "doughnut",
        data: { labels:["Instructors","Students"], datasets:[{ data:[safeNumber(data.totalInstructors), safeNumber(data.totalStudents)], backgroundColor:["#622347","#E0B4B2"] }] },
        options: { responsive:true, plugins:{legend:{labels:{color:"#fff"}}} }
      });
    };

    const loadAnalytics = async () => {
      try {
        const { data } = await getAnalytics();
        analytics.totalUsers = data?.totalUsers || 0;
        analytics.totalInstructors = data?.totalInstructors || 0;
        analytics.totalStudents = data?.totalStudents || 0;
        analytics.totalCourses = data?.totalCourses || 0;
        analytics.publishedCourses = data?.publishedCourses || 0;
        analytics.approvedCourses = data?.approvedCourses || 0;

        recent.value = data?.recentPurchases?.map(r => ({
          courseName:r.courseName||"Unknown",
          student:r.student||"Unknown",
          amount:r.amount||0,
          status:r.status||"Paid",
          date:r.date||Date.now()
        })) || [];

        setupCharts(data || {});
      } catch(e) { console.error("Error fetching analytics", e); }
    };

    // --- Notifications via Socket.IO ---
    const notifications = ref([]);
    const unreadCount = ref(0);
    const showDropdown = ref(false);

    const fetchNotifications = async () => {
      try {
        const { data } = await getNotifications();
        notifications.value = data;
        unreadCount.value = data.filter(n => !n.read).length;
      } catch (err) { console.error(err); }
    };

    const handleNewNotification = (notification) => {
      notifications.value.unshift(notification);
      unreadCount.value += 1;
    };

    const markAllRead = async () => {
      try {
        await markNotificationAsRead();
        notifications.value = notifications.value.map(n => ({ ...n, read:true }));
        unreadCount.value = 0;
      } catch (err) { console.error(err); }
    };

    onMounted(() => {
      loadAdminProfile();
      loadAnalytics();
      fetchNotifications();
      socket.connect();
      socket.on("notification", handleNewNotification);
    });

    onBeforeUnmount(() => {
      socket.off("notification", handleNewNotification);
      socket.disconnect();
    });

    return {
      analytics, recent, lineChart, doughnutChart, currentDate, search,
      mobileSidebar, logout, toggleMobileSidebar, formatDate,
      avatarUrl, defaultAvatar, avatarInput, selectAvatar, onAvatarChange,
      notifications, unreadCount, showDropdown, markAllRead,
      adminName
    };
  }
};
</script>

<style scoped>
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
