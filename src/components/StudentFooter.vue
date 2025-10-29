<template>
  <footer
    class="w-full py-4 text-sm text-gray-500 border-t border-gray-200 flex items-center justify-between px-10 bg-white"
  >
    <p>© {{ new Date().getFullYear() }} iC Academy. All rights reserved.</p>
    <div class="flex items-center gap-4 text-gray-400">
      <a href="#" class="hover:text-yellow-500 transition-colors">Privacy Policy</a>
      <a href="#" class="hover:text-yellow-500 transition-colors">Terms of Use</a>
      <a href="#" class="hover:text-yellow-500 transition-colors">Support</a>
    </div>
  </footer>
</template>

<script setup>
// nothing needed for now
</script>

<style scoped>
footer {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
