<template>
  <nav
    class="fixed top-0 left-16 w-[calc(100%-64px)] flex items-center justify-between p-4 bg-black z-50"
  >
    <!-- Logo -->
    <div class="text-[#E0B4B2] font-bold text-xl">
      <img src="../assets/iC-nobg.png" alt="iCourseLy Logo" class="w-12 h-10 object-contain" />
    </div>

    <!-- Desktop (logo only) -->
    <div class="hidden md:flex"></div>

    <!-- Mobile menu -->
    <div class="md:hidden flex gap-2">
      <!-- Login dropdown -->
      <div class="relative">
        <button
          class="px-3 py-2 bg-[#622347] text-black rounded"
          @click="toggleLoginDropdown"
        >
          Login
        </button>
        <div
          v-if="loginDropdown"
          class="absolute top-full left-0 bg-black text-white rounded mt-1 shadow-lg"
        >
          <button class="block px-4 py-2 hover:bg-gray-700 w-full">
            Login as Student
          </button>
          <button class="block px-4 py-2 hover:bg-gray-700 w-full">
            Login as Tutor
          </button>
        </div>
      </div>

      <!-- Register dropdown -->
      <div class="relative">
        <button
          class="px-3 py-2 bg-white text-black rounded"
          @click="toggleRegisterDropdown"
        >
          Register
        </button>
        <div
          v-if="registerDropdown"
          class="absolute top-full left-0 bg-black text-white rounded mt-1 shadow-lg"
        >
          <button class="block px-4 py-2 hover:bg-gray-700 w-full">
            Register as Student
          </button>
          <button class="block px-4 py-2 hover:bg-gray-700 w-full">
            Register as Tutor
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Navbar",
  setup() {
    const loginDropdown = ref(false);
    const registerDropdown = ref(false);

    const toggleLoginDropdown = () => {
      loginDropdown.value = !loginDropdown.value;
      registerDropdown.value = false;
    };
    const toggleRegisterDropdown = () => {
      registerDropdown.value = !registerDropdown.value;
      loginDropdown.value = false;
    };

    return {
      loginDropdown,
      registerDropdown,
      toggleLoginDropdown,
      toggleRegisterDropdown,
    };
  },
};
</script>
