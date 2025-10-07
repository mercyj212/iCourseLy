<template>
  <div class="relative min-h-screen font-poppins px-4">
    
    <!-- Main Content -->
    <div :class="{ 'blur-sm': showSuccessModal }" class="flex flex-col items-center justify-center min-h-screen transition duration-300">
      
      <!-- Lottie Animation at Top -->
      <LottieAnimation 
        path="/animations/thinking.json" 
        :width="animationSize" 
        :height="animationSize"
        :autoplay="true" 
        :loop="true" 
        class="mx-auto"
      />

      <!-- Page Heading -->
      <h1 class="text-5xl font-bold text-white mt-6">Forgot Password?</h1>
      <p class="text-gray-200 mt-8 text-center max-w-md text-sm">
        Enter your email address below and we'll send you a link to reset your password.
      </p>

      <!-- Forgot Password Form -->
      <form @submit.prevent="handleForgotPassword" class="w-full max-w-md space-y-5 mt-8">
        <input 
          type="email" 
          v-model="email" 
          required 
          placeholder="Enter your email"
          class="w-full h-12 border-2 border-gray-300 rounded-md px-4 py-2 bg-white text-black outline-none transition-all focus:border-[#41264b]"/>

        <button type="submit"
                class="w-full bg-[#41264b] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-[#622977] hover:scale-105 transition-transform duration-300 flex justify-center items-center gap-2"
                :disabled="loading">
          <span>{{ loading ? "Sending..." : "Send Reset Link" }}</span>
        </button>

        <p v-if="message && !showSuccessModal" :class="success ? 'text-green-600 mt-2' : 'text-red-600 mt-2'">
          {{ message }}
        </p>
      </form>

      <!-- Back to Login -->
      <p class="text-center text-md text-gray-200 mt-6">
        Remembered your password?
        <router-link to="/login" class="text-[#41264b] font-bold hover:underline decoration-2">
          Sign In
        </router-link>
      </p>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-xl p-6 sm:p-10 max-w-sm w-full text-center shadow-xl relative flex flex-col items-center">

        <!-- Success Lottie -->
        <LottieAnimation 
          path="/animations/success.json" 
          :width="150" 
          :height="150"
          size="150" 
          :autoplay="true" 
          :loop="true" 
        />

        <h2 class="text-2xl font-bold mb-4 text-black">Reset Link Sent!</h2>
        <p class="text-gray-600 mb-6 text-center">
          A reset password link has been sent to your email. Please check your inbox.
        </p>

        <button @click="showSuccessModal = false"
                class="bg-[#41264b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition">
          Close
        </button>

        <button @click="$router.push('/login')"
                class="mt-3 text-[#41264b] font-bold hover:underline">
          Go to Login
        </button>

        <button @click="showSuccessModal = false" class="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg">&times;</button>
      </div>
    </div>

  </div>
</template>


<script>
import { ref, onMounted, onBeforeUnmount } from "vue"
import LottieAnimation from "@/components/LottieAnimation.vue"
import { forgotPassword } from "@/services/auth"
import Navbar from "@/components/Navbar.vue"

export default {
  name: "ForgotPassword",
  components: { LottieAnimation, Navbar },
  setup() {
    const email = ref("")
    const loading = ref(false)
    const message = ref("")
    const success = ref(false)
    const showSuccessModal = ref(false)

    // Responsive animation size
    const animationSize = ref(180)

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        animationSize.value = 300 // large screens
      } else if (window.innerWidth >= 640) {
        animationSize.value = 220 // medium screens
      } else {
        animationSize.value = 180 // small screens
      }
    }

    onMounted(() => {
      handleResize()
      window.addEventListener("resize", handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize)
    })

    const handleForgotPassword = async () => {
      loading.value = true
      message.value = ""
      try {
        await forgotPassword({ email: email.value })
        success.value = true
        showSuccessModal.value = true
      } catch (err) {
        success.value = false
        message.value = err.response?.data?.message || "Failed to send reset link. Please try again."
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      message,
      success,
      showSuccessModal,
      handleForgotPassword,
      animationSize
    }
  }
}
</script>
