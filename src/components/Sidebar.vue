<template>
  <transition name="slide-left">
    <aside
      v-show="visible"
      class="fixed left-0 top-0 h-screen w-16 bg-black 
              flex-col items-center py-4 space-y-4 border-r border-gray-700 z-50
             hidden md:flex"
      ref="sidebarEl"
    >
      <!-- Hamburger -->
      <div class="w-full flex justify-center pb-2 border-b border-gray-700 relative">
        <button
          ref="hamburgerBtn"
          @click="toggleMenu"
          :aria-expanded="menuOpen.toString()"
          aria-controls="sidebar-menu"
          aria-label="Open menu"
          class="p-2 rounded focus:outline-none "
        >
          <svg xmlns="http://www.w3.org/2000/svg"
           class="w-6 h-6 text-[#E0B4B2]"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor">
        <!-- Top line (long) -->
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 6h18" />
        <!-- Bottom line (shorter) -->
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12h12" />
      </svg>
        </button>
      </div>

      <!-- Sidebar items -->
      <nav class="flex-1 flex flex-col items-center justify-start mt-2 gap-3">
        <SidebarItem numeral="I." label="Home" />
        <SidebarItem numeral="II." label="About" />
        <SidebarItem numeral="III." label="Courses" />
        <SidebarItem numeral="IV." label="Contact" />

    
      </nav>

      <!-- Fullscreen overlay (covers everything except sidebar) -->
      <transition name="overlay-slide">
        <div
          v-if="menuOpen"
          class="fixed left-16 top-0 h-screen w-[calc(100%-4rem)]
                 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-8"
          ref="menuEl"
        >
          <!-- Close button -->
          <button
            @click="closeMenu"
            class="absolute top-6 right-6 text-white text-4xl"
            aria-label="Close menu"
          >&times;</button>

          <!-- Big menu links -->
          <a href="#" class="text-3xl font-bold text-white hover:text-yellow-400">Profile</a>
          <a href="#" class="text-3xl font-bold text-white hover:text-yellow-400">Settings</a>
          <a href="#" class="text-3xl font-bold text-white hover:text-yellow-400">Logout</a>
        </div>
      </transition>
    </aside>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SidebarItem from './SidebarItem.vue'

const visible = true

const menuOpen = ref(false)
const sidebarEl = ref(null)
const menuEl = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
</script>

<style scoped>
/* Sidebar animation */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.6s cubic-bezier(.2,.9,.2,1), opacity 0.6s;
}
.slide-left-enter-from { transform: translateX(-20px); opacity: 0; }
.slide-left-enter-to { transform: translateX(0); opacity: 1; }
.slide-left-leave-from { transform: translateX(0); opacity: 1; }
.slide-left-leave-to { transform: translateX(-20px); opacity: 0; }

/* Overlay animation */
.overlay-slide-enter-active,
.overlay-slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.overlay-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.overlay-slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.overlay-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.overlay-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
