<template>
  <div class="min-h-screen flex items-center justify-center font-poppins overflow-hidden relative  sm:p-8 h-auto z-10 mt-20 ">
    <!-- Navbar -->
    <Navbar class="absolute top-0 left-0 right-0 z-50" :hideAuth="true" />

    <!-- Loader Overlay -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <svg class="w-12 h-12 animate-spin text-white" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke-width="4" stroke="currentColor"
          stroke-linecap="round" stroke-dasharray="282.6" stroke-dashoffset="75"/>
      </svg>
    </div>

    <!-- Register Card -->
    <div class="relative bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 h-auto overflow-hidden z-10">
      <!-- Tabs: Student / Instructor -->
      <div class="flex justify-center gap-6 mb-10">
        <button
          ref="studentBtn"
          @click="activeTab = 'student'"
          :class="tabClasses('student')"
          type="button"
        >
          Student
        </button>

        <h2 class="font-bold self-center">OR</h2>

        <button
          ref="instructorBtn"
          @click="activeTab = 'instructor'"
          :class="tabClasses('instructor')"
          type="button"
        >
          Instructor
        </button>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-5" novalidate>
        <div>
          <label class="block text-md font-bold text-black">Username</label>
          <input
            type="text"
            v-model="userName"
            required
            placeholder="Enter your username"
            class="mt-1 w-full h-12 border-2 border-white/20 rounded-md px-4 py-2 bg-transparent text-black outline-none transition-all"
          />
        </div>

        <div>
          <label class="block text-md font-bold text-black">Email</label>
          <input
            type="email"
            v-model="email"
            required
            placeholder="Enter your email"
            class="mt-1 w-full h-12 border-2 border-white/20 rounded-md px-4 py-2 bg-transparent text-black outline-none transition-all"
          />
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block text-md font-bold text-black">Password</label>
          <div class="mt-1 relative border-2 border-white/20 rounded-md">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="Enter your password"
              class="w-full h-12 pr-12 pl-4 py-2 bg-transparent text-black outline-none transition-all"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md"
            >
              <!-- Eye open -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <!-- Eye closed -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.46 21.46 0 014.12-6.06"/>
                <path d="M1 1l22 22"/>
                <path d="M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .24-.03.48-.09.7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <label class="block text-md font-bold text-black">Confirm Password</label>
          <div class="mt-1 relative border-2 border-white/20 rounded-md">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              placeholder="Confirm your password"
              class="w-full h-12 pr-12 pl-4 py-2 bg-transparent text-black outline-none transition-all"
            />
            <button
              type="button"
              @click="toggleConfirmPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md"
            >
              <!-- Eye open -->
              <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <!-- Eye closed -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.46 21.46 0 014.12-6.06"/>
                <path d="M1 1l22 22"/>
                <path d="M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .24-.03.48-.09.7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-[#1A1836] text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 flex justify-center items-center gap-2 disabled:opacity-60"
          :disabled="loading"
        >
          <span>{{ loading ? "Signing up....." : activeTab === 'student' ? 'Sign up as Student' : 'Sign Up as Instructor' }}</span>
        </button>

        <!-- Message / Error -->
        <p v-if="errorMessage" class="text-center mt-2 font-semibold" :class="success ? 'text-black' : 'text-red-800'" ref="errorMsg">
          {{ errorMessage }}
        </p>
      </form>

      <!-- Login Link -->
      <p class="text-center text-md text-black mt-4">
        Already have an account?
        <router-link to="/login" class="text-[#1A1836] font-bold hover:underline decoration-2">
          Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import gsap from "gsap";
import { register } from "../services/auth";

export default {
  name: "RegisterView",
  components: { Navbar },
  data() {
    return {
      activeTab: "student",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      errorMessage: "",
      showPassword: false,
      showConfirmPassword: false, 
      success: false
    };
  },
  mounted() {
    gsap.from([this.$refs.studentBtn, this.$refs.instructorBtn], {
      y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)"
    });
    gsap.from("form", { y: 50, opacity: 0, duration: 1.2, delay: 0.5, ease: "power2.out" });
  },
  methods: {
    tabClasses(role) {
      const base = 'rotate-90 px-6 py-3 font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all duration-500';
      if (role === 'student') return [base, this.activeTab === 'student' ? 'bg-gradient-to-r from-[#622347] via-[#E084B2] to-[#42164B] text-white' : 'bg-black text-[#E0B4B2]'];
      return [base, this.activeTab === 'instructor' ? 'bg-gradient-to-r from-[#110801] via-[#E0B4B2] to-[#42164B] text-white' : 'bg-[#0a0a0a] text-[#ad1dca]'];
    },
    togglePassword() { this.showPassword = !this.showPassword; },
    toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }, 
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        this.success = false;
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      this.success = false;

      try {
        await register({
          userName: this.userName,
          email: this.email,
          password: this.password,
          role: this.activeTab
        });

        // Show verification message instead of redirect
        this.errorMessage = "Registration successful! Please verify your email before logging in.";
        this.success = true;

      } catch (err) {
        this.errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
        this.success = false;
        this.$nextTick(() => {
          if (this.$refs.errorMsg) gsap.fromTo(this.$refs.errorMsg, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "bounce.out" });
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
