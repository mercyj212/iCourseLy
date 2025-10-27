<template>
  <div class="flex justify-between items-start px-10 py-6 bg-white">
    <!-- LEFT SIDE (Greeting + Animation) -->
    <div class="flex items-center justify-center gap-10 bg-gray-100 ml-20 rounded p-4">
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold text-gray-900 ml-4">
          Hello {{ student?.userName || "Student" }}!
        </h1>
        <p class="text-gray-500 text-sm ml-4">It’s good to see you again</p>
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
            v-model="searchQuery"
            type="text"
            placeholder="Search courses..."
            class="w-full bg-gray-100 rounded-lg px-4 py-2 text-md font-bold border border-gray-200 focus:border-purple-900 focus:outline-none"
          />
          <MagnifyingGlassIcon 
            class="w-5 h-5 text-black absolute right-3 top-2.5" 
            @click="handleSearch"
          />
        </div>

        <BellIcon class="w-6 h-6 text-gray-500 hover:text-purple-900" />

        <!-- Avatar Upload -->
        <div class="relative">
          <input
            type="file"
            accept="image/*"
            class="hidden"
            ref="avatarInput"
            @change="handleAvatarChange"
          />

          <!-- Avatar Image -->
          <img
            :src="previewImage || student?.profileImage || '/default-avatar.jpg'"
            class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer hover:ring-2 hover:ring-purple-900 transition-all duration-300"
            :disabled="isUploading"
            :class="{
              'opacity-50': isUploading,
              'opacity-100': !isUploading
            }"
            alt="Avatar"
            @click="avatarInput.click()"
          />

          <!-- Spinner Overlay -->
          <div
            v-if="isUploading"
            class="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg"
          >
            <svg
              class="w-5 h-5 animate-spin text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
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
import { getStudentDashboard } from "@/services/student.js";
import { uploadAvatar, getCurrentUser } from "@/services/user.js"; 


// Refs
const student = ref(JSON.parse(localStorage.getItem("user")) || {});
const dashboard = ref({});
const lottieContainer = ref(null);
const avatarInput = ref(null);
const isUploading = ref(false);
const previewImage = ref(null);
const searchQuery = ref("")

// Fetch current user 
onMounted(async () => {
  try {
    const { user } = await getCurrentUser();
     console.log("Fetched user from backend:", user);
    if (user) {
      student.value = user;
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (error) {
    console.warn("Could not fetch current user", error);
  }

// Load dashboard + animation
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

// Handle avatar upload
const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

   if (!student.value?._id) {
    console.error("No student ID found in localStorage!");
    return;
  }

  // Preview immediately
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);

  isUploading.value = true;

  try {
    // Upload via backend
    const data = await uploadAvatar(file);

    // Update local and memory state 
    student.value.profileImage = data.avatarUrl;
    localStorage.setItem("user", JSON.stringify(student.value));

    previewImage.value = data.avatarUrl;
    isUploading.value = false;
  } catch (err) {
    console.error("Failed to upload avatar:", err);
    isUploading.value = false;
  }
};

const handleSearch = async () => {
  const query = searchQuery.value.trim();

  if(!query) {
    console.log("Please enter a search term");
    return;
  }

  console.log("Searching for:", query);
  
}
</script>
