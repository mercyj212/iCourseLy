<template>
  <div class="min-h-screen flex items-center justify-center font-poppins px-4">

     <Navbar class="absolute top-0 left-0 right-0 z-50" :hideAuth="true" />

    <div class="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">

      <!-- Loader -->
      <div v-if="loading" class="flex flex-col items-center justify-center">
        <svg class="w-12 h-12 animate-spin text-[#1A1836]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke-width="4" stroke="currentColor"
            stroke-linecap="round" stroke-dasharray="282.6" stroke-dashoffset="75" />
        </svg>
        <p class="mt-4 text-gray-600">Working…</p>
      </div>

      <!-- STATE 1: Confirm (initial) -->
      <div v-else-if="state === 'confirm'">
        <LottieAnimation path="/animations/email-verification.json" :size="200" :loop="true" />
        <h1 class="text-2xl font-bold text-black mb-6">Verify Email</h1>
        <p class="text-gray-600 mt-2 text-sm">
          Please click the button below to verify your email and confirm that you are the owner of this account.
        </p>

        <button
          @click="resendVerificationEmail"
          class="mt-6 bg-[#42164B] text-white px-6 py-3 rounded-lg font-semibold w-full hover:bg-[#2d0f33] transition"
          :disabled="resending"
        >
          {{ resending ? "Sending..." : "Verify Email" }}
        </button>

        <p v-if="message" class="mt-4 text-sm" :class="emailSent ? 'text-green-600' : 'text-red-600'">
          {{ message }}
        </p>
      </div>

      <!-- STATE 2: Email Sent -->
      <div v-else-if="state === 'sent'">
        <LottieAnimation
          :key="animationKey"
          path="/animations/mail-sent.json" 
          :size="180" 
          :loop="false" 
        />

        <h1 class="text-2xl font-bold mt-6 text-black">Email Sent!</h1>
        <p class="text-gray-600 mt-2">
          {{ message || "Verification email sent successfully. Please check your inbox and click the link to continue." }}
        </p>

        <button
          @click="resendVerificationEmail"
          class="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold w-full hover:bg-green-600 transition"
          :disabled="resending"
        >
          {{ resending ? "Sending..." : "Resend Again" }}
        </button>
      </div>

      <!-- STATE 3: Verified -->
      <div v-else-if="state === 'verified'">
        <LottieAnimation path="/animations/thank-you.json" 
        :size="180" 
        :loop="false" 
        />

        <h1 class="text-3xl font-bold mt-6 text-black">Success!</h1>
        <p class="text-gray-600 mt-2">Your email has been verified successfully.</p>

        <router-link
          to="/login"
          class="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Continue to Login
        </router-link>
      </div>

      <!-- ERROR fallback -->
      <div v-else-if="state === 'error'">
        <p class="text-red-700 font-semibold mb-4">❌ {{ message }}</p>
        <button @click="goToLogin" class="mt-3 text-sm underline">Back to Login</button>
      </div>

    </div>
  </div>
</template>

<script>
import { verifyEmail, resendVerification } from "../services/auth";
import LottieAnimation from "../components/LottieAnimation.vue";
import Navbar from "../components/Navbar.vue";

export default {
  name: "VerifyEmail",
  components: { LottieAnimation, Navbar },
  data() {
    return {
      loading: true,
      resending: false,
      emailSent: false,
      animationKey: 0, // to reset animation
      state: "confirm", // confirm | sent | verified | error
      token: this.$route.params.token || null,
      email: this.$route.query.email || localStorage.getItem("userEmail") || null,
      message: "",
    };
  },
  async mounted() {
    // Only try to verify if token exists in URL
    if (this.token) {
      try {
        const res = await verifyEmail(this.token);
        this.state = "verified";
        this.message = res?.data?.message || "Email verified successfully.";
      } catch (err) {
        // token invalid/expired — show confirm state
        this.state = "confirm";
        this.message = err.response?.data?.message || "Invalid or expired verification link.";
      } finally {
        this.loading = false;
      }
    } else {
      // No token — show confirm state without sending email
      this.loading = false;
      if (this.$route.query.email && !this.email) {
        this.email = this.$route.query.email;
      }
    }
  },
  methods: {
    async resendVerificationEmail() {
      this.email = this.email || localStorage.getItem("userEmail") || this.$route.query.email;

      if (!this.email) {
        this.message = "No email found. Please log in again or enter your email on the login page.";
        this.state = "error";
        return;
      }

      this.resending = true;
      this.message = ""; // Clear previous message
      try {
        await resendVerification(this.email);
        this.emailSent = true;

        this.animationKey += 1; // Reset animation by changing key

        if (this.state === "sent") {
          // Already in sent state → update message to "Email Sent Again!"
          this.message = "Email Sent Again! Please check your inbox.";
        } else {
          this.state = "sent";
          this.message = "Verification email sent successfully. Please check your inbox.";
        }
      } catch (err) {
        this.state = "confirm";
        this.message = err.response?.data?.message || "Failed to resend verification email.";
      } finally {
        this.resending = false;
      }
    },
    goToLogin() {
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style scoped>
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
