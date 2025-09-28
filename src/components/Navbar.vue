<template>
  <nav
    class="fixed top-0 left-16 w-[calc(100%-64px)] flex items-center justify-between p-4 z-50"
  >
    <!-- Logo -->
    <div class="text-[#E0B4B2] font-bold text-xl">
      <img src="../assets/iC-nobg.png" alt="iCourseLy Logo" class="w-12 h-12 object-contain transform scale-200" />
    </div>

    <!-- Desktop (logo only) -->
    <div  class="hidden md:flex"></div>

    <!-- Mobile menu -->
    <div v-if="!hideAuth" class="md:hidden flex gap-2 ml-0">
      <!-- Login dropdown -->
      <div class="relative">
        <router-link to="/login" >
        <button
          class="px-3 py-2 bg-[#622347] text-black rounded"
          @click="toggleLoginDropdown"
        >
          Login
        </button>
        </router-link>
      </div>

      <!-- Register dropdown -->
      <div class="relative">
        <router-link to="/register">
        <button
          class="px-3 py-2 bg-white text-black rounded"
          @click="toggleRegisterDropdown"
        >
          Register
        </button>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Navbar",
  props: {
    hideAuth: {
      type: Boolean,
      default: false
    }
  },

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
