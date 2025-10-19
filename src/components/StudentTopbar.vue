<template>
  <div class="flex justify-between items-start px-10 py-6 bg-white ">
    <!-- LEFT SIDE (Greeting + Animation) -->
    <div class="flex items-center justify-center gap-10 bg-gray-100 ml-20 rounded p-4">
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold text-gray-900 ml-4">
          Hello {{ student?.name || 'Student' }}!
        </h1>
        <p class="text-gray-500 text-sm ml-4">It’s good to see you again 👋</p>
      </div>
      <div
        ref="lottieContainer"
        class="w-24 h-24 object-contain transform scale-[2.45] origin-center"
      ></div>
    </div>

    <!-- RIGHT SIDE (Search + Stats + Avatar) -->
    <div class="flex flex-col gap-4 w-[360px]">
      <!-- Search Bar + Avatar -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            class="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm border border-gray-200 focus:border-yellow-400 focus:outline-none"
          />
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
        </div>

        <BellIcon class="w-6 h-6 text-gray-500 hover:text-yellow-400" />

        <!-- Clickable Avatar -->
        <div class="relative">
          <input
            type="file"
            accept="image/*"
            class="hidden"
            ref="avatarInput"
            @change="handleAvatarChange"
          />
          <img
            :src="previewImage || student?.profileImage || '/default-avatar.jpg'"
            class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer hover:ring-2 hover:ring-yellow-400 transition-all duration-300"
            :class="{ 'opacity-0': isUploading, 'opacity-100': !isUploading, 'scale-95': isUploading, 'scale-100': !isUploading }"
            alt="Avatar"
            @click="avatarInput.click()"
            @load="isUploading = false"
          />
        </div>
      </div>

      <!-- Stats -->
      <div class="flex gap-3">
        <div
          class="flex-1 bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between px-6 py-4"
        >
          <h3 class="text-4xl font-extrabold text-gray-900 font-poppins">
            {{ dashboard.totalCompleted || 11 }}
          </h3>
          <p class="text-sm font-bold text-gray-500 font-poppins">Courses completed</p>
        </div>
        <div
          class="flex-1 bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between px-6 py-4"
        >
          <h3 class="text-4xl font-extrabold text-gray-900 font-poppins">
            {{ dashboard.inProgress || 4 }}
          </h3>
          <p class="text-sm font-bold text-gray-500 font-poppins">Courses in progress</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/vue/24/outline";
import lottie from "lottie-web";
import axios from "axios";
import { getStudentDashboard } from "@/services/student.js";

const student = ref(JSON.parse(localStorage.getItem("user")) || {});
const dashboard = ref({});
const lottieContainer = ref(null);
const avatarInput = ref(null);

const isUploading = ref(false);
const previewImage = ref(null);

// Load dashboard data and Lottie animation
onMounted(async () => {
  try {
    const { data } = await getStudentDashboard(student.value._id);
    dashboard.value = data;
  } catch (err) {
    console.error("Error fetching dashboard:", err);
  }

  const animationPath =
    student.value.gender === "female"
      ? "/animations/female.json"
      : "/animations/male.json";

  lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: animationPath,
  });
});

// Handle avatar upload to backend
const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Preview the selected image immediately
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    isUploading.value = true;
  };
  reader.readAsDataURL(file);

  // Prepare FormData to send to backend
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("studentId", student.value._id);

  try {
    const { data } = await axios.post("/api/student/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Update student profile image with server URL
    student.value.profileImage = data.avatarUrl;
    localStorage.setItem("user", JSON.stringify(student.value));

    // Set preview image to uploaded URL; fade-in handled by @load
    previewImage.value = data.avatarUrl;
  } catch (err) {
    console.error("Failed to upload avatar:", err);
    isUploading.value = false;
  }
};
</script>
