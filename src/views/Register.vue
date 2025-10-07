<template>
  <div class="min-h-screen flex items-center justify-center font-poppins overflow-hidden relative sm:p-8 h-auto z-10 mt-20">
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
        <button ref="studentBtn" @click="activeTab = 'student'" :class="tabClasses('student')" type="button">
          Student
        </button>
        <h2 class="font-bold self-center">OR</h2>
        <button ref="instructorBtn" @click="activeTab = 'instructor'" :class="tabClasses('instructor')" type="button">
          Instructor
        </button>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-5" novalidate>
        <!-- Username -->
        <div>
          <label class="block text-md font-bold text-black">Username</label>
          <input type="text" v-model="userName" required placeholder="Enter your username"
                 class="mt-1 w-full h-12 border-2 border-white/20 rounded-md px-4 py-2 bg-transparent text-black outline-none transition-all"/>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-md font-bold text-black">Email</label>
          <input type="email" v-model="email" required placeholder="Enter your email"
                 class="mt-1 w-full h-12 border-2 border-white/20 rounded-md px-4 py-2 bg-transparent text-black outline-none transition-all"/>
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="block text-md font-bold text-black">Password</label>
          <div class="mt-1 relative border-2 border-white/20 rounded-md">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" required placeholder="Enter your password"
                   class="w-full h-12 pr-12 pl-4 py-2 bg-transparent text-black outline-none transition-all"/>
            <button type="button" @click="togglePassword" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md">
              <!-- Eye icons omitted for brevity -->
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="relative">
          <label class="block text-md font-bold text-black">Confirm Password</label>
          <div class="mt-1 relative border-2 border-white/20 rounded-md">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" required placeholder="Confirm your password"
                   class="w-full h-12 pr-12 pl-4 py-2 bg-transparent text-black outline-none transition-all"/>
            <button type="button" @click="toggleConfirmPassword" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md">
              <!-- Eye icons omitted for brevity -->
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit"
                class="w-full bg-[#1A1836] text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 flex justify-center items-center gap-2 disabled:opacity-60"
                :disabled="loading">
          <span>{{ loading ? "Signing up....." : activeTab === 'student' ? 'Sign up as Student' : 'Sign Up as Instructor' }}</span>
        </button>
      </form>
    </div>

    <!-- Registration Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div ref="successModal" 
           class="bg-white rounded-xl p-6 sm:p-10 max-w-sm w-full text-center shadow-xl relative flex flex-col items-center opacity-0 scale-90">

        <!-- Lottie Animation (loops continuously) -->
        <LottieAnimation path="/animations/success.json" :width="120" :height="120" :autoplay="true" :loop="true" />

        <h2 class="text-2xl font-bold mb-4 text-black">Registration Successful!</h2>
        <p class="text-gray-600 mb-6">Please verify your email to continue.</p>

        <router-link :to="{ name: 'VerifyEmail', query: { email } }"
                     class="bg-[#1A1836] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d0f33] transition">
          Verify Email
        </router-link>

        <button @click="closeSuccessModal" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg">&times;</button>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import gsap from "gsap";
import { register } from "@/services/auth";
import LottieAnimation from "@/components/LottieAnimation.vue";

export default {
  name: "RegisterView",
  components: { Navbar, LottieAnimation },
  data() {
    return {
      activeTab: "student",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      showSuccessModal: false
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
        alert("Passwords do not match.");
        return;
      }

      this.loading = true;

      try {
        await register({
          userName: this.userName,
          email: this.email,
          password: this.password,
          role: this.activeTab
        });

        // Show success modal with animation
        this.showSuccessModal = true;
        this.$nextTick(() => {
          if (this.$refs.successModal) {
            gsap.fromTo(this.$refs.successModal,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
          }
        });

      } catch (err) {
        alert(err.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        this.loading = false;
      }
    },

    closeSuccessModal() {
      if (this.$refs.successModal) {
        gsap.to(this.$refs.successModal, {
          opacity: 0, scale: 0.8, duration: 0.3, ease: "power1.in",
          onComplete: () => { this.showSuccessModal = false; }
        });
      } else {
        this.showSuccessModal = false;
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
