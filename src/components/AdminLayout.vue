<template>
  <div class="min-h-screen flex text-white font-poppins relative">
    <!-- MOBILE SIDEBAR OVERLAY -->
    <div
      v-if="mobileSidebar"
      class="fixed inset-0 bg-black/60 z-40 lg:hidden"
      @click="mobileSidebar = false"
    ></div>

    <!-- SIDEBAR -->
    <aside
      :class="[
        'fixed lg:static top-0 left-0 h-full w-72 bg-[#0F1114] border-r border-yellow-400/10 flex flex-col transform transition-transform duration-300 z-50',
        mobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="px-6 py-6 flex items-center gap-3 border-b border-yellow-400/5">
        <img src="@/assets/iC-nobg.png" alt="iCourseLy Logo" class="w-12 h-12 object-contain" />
        <div>
          <div class="text-lg font-bold text-[#E0B4B2]">iCourseLy</div>
          <div class="text-xs text-gray-400">Admin Panel</div>
        </div>
      </div>

      <nav class="mt-6 px-3 flex-1 space-y-1 overflow-y-auto">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition"
          active-class="bg-white/10 text-purple-400 font-semibold"
          @click="mobileSidebar = false"
        >
          <component :is="link.icon" class="w-5 h-5 text-[#E0B4B2]" />
          <span>{{ link.label }}</span>
        </router-link>
      </nav>

      <div class="px-6 pb-6">
        <button
          @click="logout"
          class="w-full bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 py-2 rounded-md font-semibold transition"
        >
          Logout
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 min-h-screen lg:ml-0">
      <!-- TOPBAR -->
      <header
        class="flex items-center justify-between px-6 py-4 bg-[#0F1114]/80 backdrop-blur-md border-b border-purple-400/10 sticky top-0 z-30"
      >
        <div class="flex items-center gap-4">
          <button
            class="lg:hidden p-2 rounded-md bg-[#141414] text-gray-300"
            @click="toggleSidebar"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-[#E0B4B2] tracking-wide">
              Hello, {{ adminName || "Admin" }}
            </h1>
            <p class="text-sm text-gray-400">An Overview of your platform</p>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <div class="hidden sm:block">
            <input
              v-model="search"
              placeholder="Search..."
              class="bg-[#111214] placeholder-gray-400 text-sm px-3 py-2 rounded-md outline-none w-48 sm:w-64"
            />
          </div>

          <!-- Notification Bell -->
          <div class="relative">
            <button
              @click="showDropdown = !showDropdown"
              class="p-2 rounded-full bg-[#141414] hover:bg-[#1b1b1b] transition relative"
            >
              <BellIcon class="w-5 h-5 text-yellow-300" />
              <span
                v-if="unreadCount"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-80 bg-[#111214] border border-yellow-400/10 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div class="flex justify-between items-center px-4 py-2 border-b border-yellow-400/10">
                <span class="text-sm font-semibold text-[#E0B4B2]">Notifications</span>
                <button
                  @click="markAllRead"
                  class="text-xs text-gray-400 hover:text-yellow-300"
                >
                  Mark all read
                </button>
              </div>
              <ul class="max-h-64 overflow-y-auto">
                <li
                  v-for="n in notifications"
                  :key="n._id"
                  :class="n.read ? 'bg-[#111214]' : 'bg-[#1b1b1b]'"
                  class="px-4 py-3 border-b border-yellow-400/5"
                >
                  <p class="text-sm">{{ n.message }}</p>
                  <p class="text-xs text-gray-400">{{ new Date(n.createdAt).toLocaleString() }}</p>
                </li>
                <li
                  v-if="notifications.length === 0"
                  class="px-4 py-3 text-center text-gray-500"
                >
                  No notifications
                </li>
              </ul>
            </div>
          </div>

          <!-- Avatar -->
          <div class="flex items-center gap-3">
            <img
              :src="avatarUrl || defaultAvatar"
              alt="admin"
              class="w-9 h-9 rounded-full border-2 border-[#E0B4B2]/40 cursor-pointer"
              @click="selectAvatar"
            />
            <input
              type="file"
              ref="avatarInput"
              class="hidden"
              @change="onAvatarChange"
              accept="image/*"
            />
            <div class="text-right hidden sm:block">
              <div class="text-sm font-semibold">{{ adminName || "Admin" }}</div>
              <div class="text-xs text-gray-400">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="p-4 sm:p-6 lg:p-8 space-y-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

// State
const mobileSidebar = ref(false);
const showDropdown = ref(false);
const search = ref("");
const notifications = ref([]);
const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);
const adminName = ref(localStorage.getItem("adminName") || "Admin");
const avatarUrl = ref("");
const defaultAvatar = "/default-avatar.png";
const currentDate = ref(new Date().toLocaleDateString());

const avatarInput = ref(null);

// Sidebar links
const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: ChartBarIcon },
  { to: "/admin/manage-courses", label: "Courses", icon: AcademicCapIcon },
  { to: "/admin/manage-instructors", label: "Instructors", icon: UserGroupIcon },
  { to: "/admin/manage-students", label: "Students", icon: UserGroupIcon },
  { to: "/admin/analytics", label: "Analytics", icon: ChartPieIcon },
  { to: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
];

// Handlers
const toggleSidebar = () => (mobileSidebar.value = !mobileSidebar.value);
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  router.push("/login");
};

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true));
};

const selectAvatar = () => avatarInput.value?.click();
const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarUrl.value = URL.createObjectURL(file);
  }
};

// Simulate notifications for demo
onMounted(() => {
  notifications.value = [
    { _id: 1, message: "New student registered!", createdAt: new Date(), read: false },
    { _id: 2, message: "Instructor uploaded a new course.", createdAt: new Date(), read: true },
  ];
});
</script>

<style scoped>
.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>
