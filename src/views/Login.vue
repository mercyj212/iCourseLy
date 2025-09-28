<template>
  <div class="min-h-screen flex items-center justify-center font-poppins overflow-hidden relative">
    <!-- Navbar -->
    <Navbar class="absolute top-0 left-0 right-0 z-50" :hideAuth="true" />

    <!-- Loader Overlay -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <svg class="w-12 h-12 animate-spin text-white" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke-width="4" stroke="currentColor"
          stroke-linecap="round" stroke-dasharray="282.6" stroke-dashoffset="75"/>
      </svg>
    </div>

    <!-- Login Card -->
    <div class="relative bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 h-auto overflow-hidden z-10">
      <!-- Tabs: Student / Instructor -->
      <div class="flex justify-center gap-6 mb-10">
        <button
          ref="studentBtn"
          @mouseenter="hoverStudent"
          @mouseleave="leaveStudent"
          @click="activeTab = 'student'"
          :class="tabClasses('student')"
          type="button"
        >
          Student
        </button>

        <h2 class="font-bold self-center">OR</h2>

        <button
          ref="instructorBtn"
          @mouseenter="hoverInstructor"
          @mouseleave="leaveInstructor"
          @click="activeTab = 'instructor'"
          :class="tabClasses('instructor')"
          type="button"
        >
          Instructor
        </button>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
        <div>
          <label class="block text-md font-bold text-black">Email</label>
          <input
            type="email"
            v-model="email"
            required
            placeholder="Enter your email"
            class="mt-1 w-full h-12 border-2 border-white/20 rounded-md px-4 py-2 bg-transparent text-black outline-none focus:ring-offset-1 transition-all"
            autocomplete="email"
          />
        </div>

        <div class="relative">
          <label class="block text-md font-bold text-black">Password</label>

          <!-- Password input wrapper so the eye sits inside -->
          <div class="mt-1 relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="Enter your password"
              class="w-full h-12 border-2 border-white/20 rounded-md pr-12 pl-4 py-2 bg-transparent text-black outline-none transition-all"
              autocomplete="current-password"
            />

            <!-- Eye button inside input (right) -->
            <button
              type="button"
              @click="togglePassword"
              :aria-pressed="showPassword.toString()"
              :title="showPassword ? 'Hide password' : 'Show password'"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md "
            >
              <!-- switch icons based on state -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <!-- Eye icon -->
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <!-- Eye-off icon -->
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.46 21.46 0 014.12-6.06"></path>
                <path d="M1 1l22 22"></path>
                <path d="M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .24-.03.48-.09.7"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <router-link
            to="/forgot-password"
            class="text-md text-black font-medium hover:underline decoration-2"
          >
            Forgot Password?
          </router-link>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-[#1A1836] text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 flex justify-center items-center gap-2 disabled:opacity-60"
          :disabled="loading"
        >
          <span>{{ activeTab === 'student' ? 'Login as Student' : 'Login as Instructor' }}</span>
          <svg v-if="loading" class="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </button>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-red-500 text-center mt-2 font-semibold" ref="errorMsg">
          {{ errorMessage }}
        </p>
      </form>

      <!-- Register Link -->
      <p class="text-center text-md text-black mt-4">
        Don’t have an account?
        <router-link to="/register" class="text-[#1A1836] font-bold hover:underline decoration-2">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import gsap from "gsap";
import { login } from "../services/auth";

export default {
  name: "LoginView",
  components: { Navbar },
  data() {
    return {
      activeTab: "student",
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
      showPassword: false
    };
  },
  mounted() {
    // Entrance animations
    gsap.from([this.$refs.studentBtn, this.$refs.instructorBtn], {
      y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)"
    });
    gsap.from("form", { y: 50, opacity: 0, duration: 1.2, delay: 0.5, ease: "power2.out" });
  },
  methods: {
    hoverStudent() { gsap.to(this.$refs.studentBtn, { scale: 1.1, rotation: -5, duration: 0.3, ease: "power2.out" }); },
    leaveStudent() { gsap.to(this.$refs.studentBtn, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" }); },
    hoverInstructor() { gsap.to(this.$refs.instructorBtn, { scale: 1.1, rotation: 5, duration: 0.3, ease: "power2.out" }); },
    leaveInstructor() { gsap.to(this.$refs.instructorBtn, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" }); },

    tabClasses(role) {
      const base = 'rotate-90 px-6 py-3 font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all duration-500';
      if (role === 'student') {
        return [base, this.activeTab === 'student' ? 'bg-gradient-to-r from-[#622347] via-[#E084B2] to-[#42164B] text-white' : 'bg-black text-[#E0B4B2]'];
      }
      return [base, this.activeTab === 'instructor' ? 'bg-gradient-to-r from-[#110801] via-[#E0B4B2] to-[#42164B] text-white' : 'bg-[#0a0a0a] text-[#ad1dca]'];
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
      // Optional: brief animation on toggle
      gsap.fromTo(this.$el.querySelector('input[type="' + (this.showPassword ? 'text' : 'password') + '"]'), { scale: 0.99 }, { scale: 1, duration: 0.12 });
    },

    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const response = await login({ email: this.email, password: this.password });
        const user = response.data;

        // Role validation
        if (user.role !== this.activeTab) {
          this.loading = false;
          this.errorMessage = `You are not a ${this.activeTab}`;
          gsap.fromTo(this.$refs.errorMsg, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "bounce.out" });
          return;
        }

        // success
        this.loading = false;
        localStorage.setItem("token", user.token);

        if (user.role === "student") this.$router.push("/student-dashboard");
        else if (user.role === "instructor") this.$router.push("/instructor-dashboard");
        else this.$router.push("/admin-dashboard");

      } catch (err) {
        this.loading = false;
        this.errorMessage = err.response?.data?.message || "Invalid credentials, please try again.";
        // animate error
        this.$nextTick(() => {
          if (this.$refs.errorMsg) gsap.fromTo(this.$refs.errorMsg, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "bounce.out" });
        });
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
.font-poppins { font-family: "Poppins", sans-serif; }


input[type="password"],
input[type="text"] {
  border: none;
}

/* Optional: slightly darker focus ring for the eye button */
button[aria-pressed] {
  background: transparent;
}
</style>
