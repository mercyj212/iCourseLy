<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-poppins">
    <div class="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
      <!-- Page Title -->
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>

      <!-- Password Reset Form -->
      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <input
          type="password"
          v-model="password"
          required
          placeholder="Enter new password"
          class="w-full h-12 border-2 border-gray-300 rounded-md px-4 py-2 text-black outline-none transition focus:border-pink-600"
        />

        <input
          type="password"
          v-model="confirmPassword"
          required
          placeholder="Confirm new password"
          class="w-full h-12 border-2 border-gray-300 rounded-md px-4 py-2 text-black outline-none transition focus:border-pink-600"
        />

        <button
          type="submit"
          class="w-full bg-pink-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-pink-700 transition"
          :disabled="loading"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>

        <!-- Success/Error Message -->
        <p v-if="message" :class="success ? 'text-green-600' : 'text-red-600'" class="mt-3 text-center">
          {{ message }}
        </p>
      </form>

      <!-- Back to Login -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Remembered your password?
        <router-link to="/login" class="text-pink-600 font-bold hover:underline">
          Sign In
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { resetPassword } from "../services/auth"

export default {
  name: "ResetPassword",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const token = route.params.token

    const password = ref("")
    const confirmPassword = ref("")
    const loading = ref(false)
    const message = ref("")
    const success = ref(false)

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
        message.value = "Password reset successfully!"
        setTimeout(() => router.push("/login"), 2000) // redirect after 2s
      } catch (err) {
        success.value = false
        message.value = err.response?.data?.message || "Failed to reset password. Try again."
      } finally {
        loading.value = false
      }
    }

    return { password, confirmPassword, loading, message, success, handleResetPassword }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
