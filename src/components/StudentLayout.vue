<template>
  <div class="flex min-h-screen bg-[#0B0B0F] text-white font-poppins relative overflow-hidden">
    <!-- MOBILE SIDEBAR OVERLAY -->
    <transition name="fade">
      <div
        v-if="mobileSidebar"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        @click="mobileSidebar = false"
      ></div>
    </transition>

    <!-- SIDEBAR -->
    <transition name="slide">
      <aside
        v-show="mobileSidebar || isDesktop"
        class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0F1114] border-r border-yellow-400/10 flex flex-col z-50 shadow-xl"
      >
        <!-- LOGO -->
        <div class="px-6 py-6 flex items-center gap-3 border-b border-yellow-400/5 shrink-0">
          <img src="@/assets/iC-nobg.png" alt="Logo" class="w-10 h-10 object-contain" />
          <div>
            <div class="text-lg font-bold text-[#E0B4B2]">iCourseLy</div>
            <div class="text-xs text-gray-400">Student Panel</div>
          </div>
        </div>

        <!-- LINKS -->
        <nav class="mt-6 px-3 flex-1 space-y-1 overflow-y-auto">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-purple-400/20 transition"
            active-class="bg-white/10 text-purple-400 font-semibold"
            @click="closeMobileSidebar"
          >
            <component :is="link.icon" class="w-5 h-5 text-[#E0B4B2]" />
            <span class="truncate">{{ link.label }}</span>
          </router-link>
        </nav>

        <!-- LOGOUT -->
        <div class="px-6 pb-6 border-t border-yellow-400/5">
          <button
            @click="logout"
            class="w-full bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 py-2 rounded-md font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </transition>

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-20 transition-all duration-300">
      <!-- TOPBAR -->
      <header
        class="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0F1114]/90 backdrop-blur-md border-b border-purple-400/10 sticky top-0 z-30"
      >
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Hamburger -->
          <button
            class="lg:hidden p-2 rounded-md bg-[#141414] text-gray-300 hover:bg-purple-400/20 transition"
            @click="toggleSidebar"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>

          <!-- Greeting -->
          <div>
            <h1 class="text-base sm:text-lg font-bold text-[#E0B4B2] tracking-wide">
              Welcome, {{ studentName || "Student" }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-400">Your learning dashboard</p>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Search -->
          <input
            v-model="search"
            placeholder="Search..."
            class="bg-[#111214] placeholder-gray-400 text-xs sm:text-sm px-3 py-2 rounded-md outline-none w-36 sm:w-56 focus:ring-1 focus:ring-purple-400/30 transition"
          />

          <!-- Avatar -->
          <div class="flex items-center gap-2 sm:gap-3">
            <img
              :src="avatarUrl || defaultAvatar"
              alt="student"
              class="w-9 h-9 rounded-full border-2 border-[#E0B4B2]/40 cursor-pointer hover:scale-105 transition"
              @click="selectAvatar"
            />
            <input
              type="file"
              ref="avatarInput"
              class="hidden"
              @change="onAvatarChange"
              accept="image/*"
            />
          </div>
        </div>
      </header>

      <!-- MAIN AREA -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Bars3Icon, AcademicCapIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const mobileSidebar = ref(false);
const isDesktop = ref(false);
const search = ref("");
const studentName = ref(localStorage.getItem("studentName") || "Student");
const avatarUrl = ref("");
const defaultAvatar = "/default-avatar.png";
const avatarInput = ref(null);

const links = [
  { to: "/student", label: "Dashboard", icon: ChartBarIcon },
  { to: "/student/courses", label: "Browse Courses", icon: AcademicCapIcon },
  { to: "/student/my-courses", label: "My Courses", icon: UserGroupIcon },
  { to: "/student/profile", label: "Profile", icon: UserGroupIcon },
];

const toggleSidebar = () => (mobileSidebar.value = !mobileSidebar.value);
const closeMobileSidebar = () => (mobileSidebar.value = false);

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  router.push("/login");
};

const selectAvatar = () => avatarInput.value?.click();
const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) avatarUrl.value = URL.createObjectURL(file);
};

// detect screen size
const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) mobileSidebar.value = false;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => window.removeEventListener("resize", handleResize));
</script>

<style scoped>
.font-poppins {
  font-family: "Poppins", sans-serif;
}

/* transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
