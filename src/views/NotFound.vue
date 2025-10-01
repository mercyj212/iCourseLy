<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center px-6 font-poppins">
    
    <!-- Lottie Animation -->
    <LottieAnimation 
      path="/animations/404.json" 
      :width="animationSize" 
      :height="animationSize" 
      :autoplay="true" 
      :loop="true" 
      class="mb-6"
    />

    <!-- Title -->
    <!-- <h1 class="text-5xl sm:text-6xl font-bold text-white">404</h1> -->
    <p class="text-gray-300 mt-4 text-lg sm:text-xl">
      Oops! The page you are looking for doesn’t exist.
    </p>

    <!-- Buttons -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4">
      <router-link 
        to="/" 
        class="bg-[#42164b] hover:bg-[#89209e] text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition">
        Go Home
      </router-link>
      
      <router-link 
        to="/login" 
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow">
        Back to Login
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue"
import LottieAnimation from "../components/LottieAnimation.vue"

export default {
  name: "NotFound",
  components: { LottieAnimation },
  setup() {
    const animationSize = ref(250)

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        animationSize.value = 400
      } else if (window.innerWidth >= 640) {
        animationSize.value = 300
      } else {
        animationSize.value = 200
      }
    }

    onMounted(() => {
      handleResize()
      window.addEventListener("resize", handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize)
    })

    return { animationSize }
  }
}
</script>
