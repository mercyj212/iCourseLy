<template>
  <div class="relative min-h-screen bg-black text-white overflow-hidden">
    <!-- Loader -->
    <div v-if="loading" class="absolute bottom-4 left-20 flex flex-col items-center">
      <svg class="w-10 h-10" viewBox="0 0 100 100">
        <circle
          class="text-[#E0B4B2]"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="4"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-dasharray="282.6"
          stroke-dashoffset="282.6"
          ref="loaderCircle"
        />
      </svg>
      <p class="mt-2 text-xs">Loading...</p>
    </div>

    <!-- Main Text -->
    <div
      ref="textContainer"
      class="absolute inset-0 flex flex-col justify-center items-center text-center space-x-6"
    >
      <div
        v-for="(line, index) in splitLines"
        :key="index"
        class="mb-0 leading-none tracking-wide font-bold uppercase text-[50px] sm:text-[80px] md:text-[120px] lg:text-[130px]"
      >
        <!-- Each character -->
        <span
          v-for="(char, cIndex) in line"
          :key="cIndex"
          class="inline-block letter"
          :class="{ 'text-[#E0B4B2] italic lowercase': lines[index] === 'iCourseLy', 'text-[#622347]': lines[index] !== 'iCourseLy' }"
        >
          {{ char }}
        </span>
      </div>
    </div>

    <!-- Sidebar (desktop only) -->
    <Sidebar
      ref="sidebar"
      v-if="sidebarVisible && !isMobile"
      class="absolute left-0 top-0 h-full"
    />

    <!-- Navbar -->
    <Navbar
      ref="navbar"
      v-if="navbarVisible"
      class="absolute top-0 left-16 right-0"
    />
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import gsap from "gsap";
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Home",
  components: { Sidebar, Navbar },
  setup() {
    const loading = ref(true);
    const sidebarVisible = ref(false);
    const navbarVisible = ref(false);
    const loaderCircle = ref(null);
    const textContainer = ref(null);
    const sidebar = ref(null);
    const navbar = ref(null);

    const lines = ["start An", "iCourseLy", "COPYWRITing", "journey"];
    const splitLines = lines.map(line => line.split("")); // array of characters
    const isMobile = window.innerWidth < 768;

    onMounted(() => {
      // Loader animation
      gsap.to(loaderCircle.value, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "steps(100)",
        onComplete: () => (loading.value = false)
      });

      // Animate letters in
      setTimeout(() => {
        const letters = textContainer.value.querySelectorAll(".letter");
        gsap.fromTo(
          letters,
          { opacity: 0, y: window.innerHeight },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.05,
            ease: "power2.out",
            onComplete: handleTextAnimation
          }
        );
      }, 600);

      // Scatter effect
      window.addEventListener("mousemove", scatterEffect);
      window.addEventListener("mouseleave", resetEffect);
    });

    // Scatter letters
    function scatterEffect() {
      const letters = textContainer.value.querySelectorAll(".letter");
      letters.forEach(letter => {
        gsap.to(letter, {
          x: gsap.utils.random(-50, 50),
          y: gsap.utils.random(-80, 80),
          rotation: gsap.utils.random(-45, 45),
          duration: 0.5,
          ease: "power2.out"
        });
      });
    }

    // Reset letters
    function resetEffect() {
      const letters = textContainer.value.querySelectorAll(".letter");
      gsap.to(letters, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      });
    }

    function handleTextAnimation() {
      if (isMobile) {
        gsap.to(textContainer.value, {
          y: -window.innerHeight / 7,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            navbarVisible.value = true;
            nextTick(() => {
              gsap.fromTo(
                navbar.value.$el,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
              );
            });
          }
        });
      } else {
        moveTextLeft();
      }
    }

    async function moveTextLeft() {
      const sidebarWidth = sidebar.value ? sidebar.value.$el.offsetWidth : 0;
      const padding = 20;
      const moveDistance = window.innerWidth / 9 - sidebarWidth - padding;

      gsap.to(textContainer.value, {
        x: -moveDistance,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: async () => {
          gsap.to(textContainer.value, {
            y: -window.innerHeight / 20,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: async () => {
              sidebarVisible.value = true;
              navbarVisible.value = true;

              await nextTick();

              gsap.fromTo(
                sidebar.value.$el,
                { x: -sidebarWidth - 50 },
                { x: 0, duration: 1, ease: "power2.out" }
              );

              gsap.fromTo(
                navbar.value.$el,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
              );
            }
          });
        }
      });
    }

    return {
      loading,
      loaderCircle,
      textContainer,
      lines,
      splitLines,
      sidebar,
      navbar,
      sidebarVisible,
      navbarVisible,
      isMobile
    };
  }
};
</script>
