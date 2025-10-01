<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 font-poppins">

    <!-- Loader Overlay -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <svg class="w-12 h-12 animate-spin text-white" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="none" stroke-width="4" stroke="currentColor"
          stroke-linecap="round" stroke-dasharray="282.6" stroke-dashoffset="75"/>
      </svg>
    </div>

    <!-- Lottie Animation -->
    <LottieAnimation 
      path="/animations/reset.json" 
      :width="isMobile ? 150 : isTablet ? 200 : 250" 
      :height="isMobile ? 150 : isTablet ? 200 : 250"
      :autoplay="true" 
      :loop="true" 
      class="mb-6"
    />

    <!-- Page Title -->
    <h1 :class="isMobile ? 'text-2xl' : 'text-4xl'" class="font-bold text-white mb-4">
      Reset Password
    </h1>
    <p :class="isMobile ? 'text-sm' : 'text-base'" class="text-white mb-8 text-center max-w-md">
      Enter your new password below to complete the reset process.
    </p>

    <!-- Reset Password Form -->
    <form @submit.prevent="handleResetPassword" class="w-full max-w-md space-y-5">
      <!-- New Password -->
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          required
          placeholder="Enter new password"
          :class="isMobile 
            ? 'w-full h-10 text-sm px-3 py-2' 
            : 'w-full h-12 text-base px-4 py-2'"
          class="border-2 border-gray-300 rounded-md text-white outline-none transition focus:border-[#41264b]"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          <!-- Eye icons -->
          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.338-4.045M6.2 6.2A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.972 9.972 0 01-4.338 5.045M6.2 6.2L3 3m3.2 3.2l12.6 12.6M17.8 17.8L21 21" />
          </svg>
        </button>
      </div>

      <!-- Confirm Password -->
      <div class="relative">
        <input
          :type="showConfirm ? 'text' : 'password'"
          v-model="confirmPassword"
          required
          placeholder="Confirm new password"
          :class="isMobile 
            ? 'w-full h-10 text-sm px-3 py-2' 
            : 'w-full h-12 text-base px-4 py-2'"
          class="border-2 border-gray-300 rounded-md text-white outline-none transition focus:border-[#41264b]"
        />
        <button
          type="button"
          @click="showConfirm = !showConfirm"
          class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          <!-- Eye icons -->
          <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.338-4.045M6.2 6.2A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.972 9.972 0 01-4.338 5.045M6.2 6.2L3 3m3.2 3.2l12.6 12.6M17.8 17.8L21 21" />
          </svg>
        </button>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :class="isMobile 
          ? 'w-full bg-[#41264b] text-white font-bold py-2 rounded-lg text-sm' 
          : 'w-full bg-[#41264b] text-white font-bold py-3 rounded-lg text-base'"
        class="shadow-lg hover:bg-[#78488a] transition"
        :disabled="loading"
      >
        {{ loading ? "Resetting..." : "Reset Password" }}
      </button>

      <p v-if="message && !showSuccessModal" :class="success ? 'text-green-600' : 'text-red-600'" class="mt-3 text-center">
        {{ message }}
      </p>
    </form>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div class="bg-white rounded-xl p-6 sm:p-10 max-w-sm w-full text-center shadow-xl relative flex flex-col items-center">
        <!-- Success Animation -->
        <LottieAnimation
          path="/animations/success.json"
          :width="150"
          :height="150"
          size="150"
          :autoplay="true"
          :loop="false"
        />
        <h2 class="text-2xl font-bold mb-4 text-black">Password Reset!</h2>
        <p class="text-gray-600 mb-6 text-center">
          Your password has been reset successfully. You can now log in.
        </p>
        <button @click="$router.push('/login')"
          class="bg-[#41264b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#714183] transition">
          Go to Login
        </button>
        <button @click="showSuccessModal = false" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg">&times;</button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { resetPassword } from "../services/auth"
import LottieAnimation from "../components/LottieAnimation.vue"

export default {
  name: "ResetPassword",
  components: { LottieAnimation },
  setup() {
    const route = useRoute()
    const token = route.params.token

    const password = ref("")
    const confirmPassword = ref("")
    const showPassword = ref(false)
    const showConfirm = ref(false)

    const loading = ref(false)
    const message = ref("")
    const success = ref(false)
    const showSuccessModal = ref(false)

    // Screen size reactive states
    const screenWidth = ref(window.innerWidth)
    const isMobile = ref(window.innerWidth < 640)
    const isTablet = ref(window.innerWidth >= 640 && window.innerWidth < 1024)

    const updateSize = () => {
      screenWidth.value = window.innerWidth
      isMobile.value = window.innerWidth < 640
      isTablet.value = window.innerWidth >= 640 && window.innerWidth < 1024
    }

    onMounted(() => {
      window.addEventListener("resize", updateSize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateSize)
    })

    const handleResetPassword = async () => {
      if (password.value !== confirmPassword.value) {
        message.value = "Passwords do not match"
        success.value = false
        return
      }

      loading.value = true
      message.value = ""
      try {
        await resetPassword(token, password.value)
        success.value = true
        showSuccessModal.value = true
      } catch (err) {
        success.value = false
        message.value =
          err.response?.data?.message || "Failed to reset password. Try again."
      } finally {
        loading.value = false
      }
    }

    return {
      password,
      confirmPassword,
      showPassword,
      showConfirm,
      loading,
      message,
      success,
      showSuccessModal,
      handleResetPassword,
      screenWidth,
      isMobile,
      isTablet
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
