<template>
  <div class="flex min-h-screen font-poppins bg-[#F9FAFB] text-gray-900">
    <!-- SIDEBAR -->
    <StudentSidebar />

    <!-- MAIN CONTENT AREA -->
    <div class="flex-1 flex flex-col ml-20 bg-white rounded-l-3xl shadow-sm relative overflow-hidden">
      <!-- TOPBAR -->
      <StudentTopbar />

      <!-- MAIN CONTENT -->
      <main class="flex-1 overflow-y-auto px-10 py-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import StudentSidebar from "@/components/StudentSidebar.vue";
import StudentTopbar from "@/components/StudentTopbar.vue";
</script>

<style scoped>
main {
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
