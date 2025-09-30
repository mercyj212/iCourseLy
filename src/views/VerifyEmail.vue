<template>
  <div class="min-h-screen flex items-center justify-center font-poppins px-4">
    <!-- Loader Overlay -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <svg class="w-12 h-12 animate-spin text-white" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="4"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-dasharray="282.6"
          stroke-dashoffset="75"
        />
      </svg>
    </div>

    <!-- Card -->
    <div class="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
      <h1 class="text-2xl font-bold mb-4">Email Verification</h1>

      <!-- Success -->
      <div v-if="success">
        <p class="text-green-700 font-semibold mb-4">✅ {{ message }}</p>
        <router-link to="/login" class="text-blue-600 font-bold hover:underline">
          Go to Login
        </router-link>
      </div>

      <!-- Error -->
      <div v-else>
        <p class="text-red-700 font-semibold mb-4">❌ {{ message }}</p>

        <!-- Email input if missing -->
        <div v-if="!email">
          <input
            v-model="emailInput"
            type="email"
            placeholder="Enter your email to resend"
            class="border p-2 rounded w-full mb-4"
          />
          <button
            @click="resendVerificationEmail"
            class="bg-[#1A1836] text-white px-4 py-2 rounded-md font-bold hover:scale-105 transition-transform w-full"
            :disabled="resending || !emailInput"
          >
            {{ resending ? "Resending..." : "Resend Verification Email" }}
          </button>
        </div>

        <!-- Resend button if email exists -->
        <div v-else>
          <button
            @click="resendVerificationEmail"
            class="bg-[#1A1836] text-white px-4 py-2 rounded-md font-bold hover:scale-105 transition-transform w-full"
            :disabled="resending"
          >
            {{ resending ? "Resending..." : "Resend Verification Email" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyEmail, resendVerification } from "../services/auth";

export default {
  name: "VerifyEmail",
  data() {
    return {
      loading: true,
      resending: false,
      success: false,
      message: "",
      token: this.$route.params.token || null,
      email: localStorage.getItem("userEmail") || this.$route.query.email || null,
      emailInput: "",
    };
  },
  async mounted() {
    if (!this.token) {
      this.success = false;
      this.message = "No verification token provided.";
      this.loading = false;
      return;
    }

    try {
      const res = await verifyEmail(this.token);
      this.success = true;
      this.message = res.data.message || "Your email has been verified successfully!";
    } catch (err) {
      this.success = false;
      this.message =
        err.response?.data?.message || "Invalid or expired verification link.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async resendVerificationEmail() {
      const emailToUse = this.email || this.emailInput;
      if (!emailToUse) {
        this.message = "Please provide a valid email to resend verification.";
        return;
      }

      this.resending = true;
      try {
        await resendVerification(emailToUse);
        this.message = "A new verification email has been sent to your inbox.";
        this.email = emailToUse;
      } catch (err) {
        this.message =
          err.response?.data?.message || "Failed to resend verification email.";
      } finally {
        this.resending = false;
      }
    },
  },
};
</script>

<style scoped>
.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>
