<template>
  <div class="relative min-h-screen bg-trans text-white overflow-hidden">
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
      <span
        v-for="(line, index) in lines"
        :key="index"
        class="opacity-0 text-[50px] sm:text-[80px] md:text-[120px] lg:text-[130px] font-bold mb-0 leading-none tracking-wide uppercase text-[#622347]"
      >
        <span v-if="line === 'iCourseLy'" class="text-[#E0B4B2] italic lowercase">
          {{ line }}
        </span>
        <span v-else>
          {{ line }}
        </span>
      </span>
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
    const isMobile = window.innerWidth < 768;

    onMounted(() => {
      // Ensure loader shows
      loading.value = true;

      // Animate loader
      gsap.to(loaderCircle.value, {
        strokeDashoffset: 0,
        duration: 3,
        ease: "steps(100)",
        onComplete: () => {
          loading.value = false; // Hide loader when done
        }
      });

      // Start text animation at 30% of loader duration
      setTimeout(() => {
        Array.from(textContainer.value.children).forEach((line, index) => {
          gsap.fromTo(
            line,
            { opacity: 0, y: window.innerHeight },
            {
              opacity: 1,
              y: 0,
              duration: 2,
              delay: index * 0.7,
              ease: "power2.out",
              onComplete: index === lines.length - 1 ? handleTextAnimation : null
            }
          );
        });
      }, 1000 * 0.2);
    });

    function handleTextAnimation() {
      if (isMobile) {
        // 📱 Mobile: center → top only
        gsap.to(textContainer.value, {
          y: -window.innerHeight / 7,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            // Show navbar on mobile
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
        // 💻 Desktop: original flow
        moveTextLeft();
      }
    }

    async function moveTextLeft() {
      const sidebarWidth = sidebar.value ? sidebar.value.$el.offsetWidth : 0;
      const padding = 20;
      const moveDistance = window.innerWidth / 9 - sidebarWidth - padding;

      // Slide text to left
      gsap.to(textContainer.value, {
        x: -moveDistance,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: async () => {
          // Move text up
          gsap.to(textContainer.value, {
            y: -window.innerHeight / 20,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: async () => {
              // Show sidebar + navbar at the same time
              sidebarVisible.value = true;
              navbarVisible.value = true;

              await nextTick();

              // Sidebar animation
              gsap.fromTo(
                sidebar.value.$el,
                { x: -sidebarWidth - 50 },
                { x: 0, duration: 1, ease: "power2.out" }
              );

              // Navbar animation
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
      sidebar,
      navbar,
      sidebarVisible,
      navbarVisible,
      isMobile
    };
  }
};
</script>
