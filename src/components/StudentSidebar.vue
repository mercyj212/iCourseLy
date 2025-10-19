<template>
  <aside
    class="fixed left-0 top-0 h-screen w-20 bg-[#0B0B0F] flex flex-col justify-between items-center py-6 rounded-r-3xl shadow-xl z-50"
    aria-label="Student Navigation Sidebar"
  >
    <!-- Logo -->
    <div class="flex flex-col items-center gap-1 mb-6 shrink-0">
      <img src="@/assets/iC-nobg.png" alt="Logo" class="w-10 h-10 object-contain" />
    </div>

    <!-- Scrollable Navigation -->
    <div class="flex-1 w-full overflow-y-auto overflow-x-hidden">
      <nav class="flex flex-col items-center gap-6 mt-4 pb-6 relative">
        <StudentSidebarLink
          v-for="link in links"
          :key="link.label"
          :icon="link.icon"
          :route="link.route"
          :tooltip="link.label"
        />
      </nav>
    </div>

    <!-- Logout Button -->
    <div class="mt-4 mb-4 shrink-0">
      <StudentSidebarLink icon="ArrowLeftOnRectangleIcon" route="/logout" tooltip="Logout" />
    </div>
  </aside>
</template>

<script setup>
import StudentSidebarLink from "./StudentSidebarLink.vue";

const links = [
  { icon: "HomeIcon", label: "Dashboard", route: "/student/dashboard" },
  { icon: "BookOpenIcon", label: "My Courses", route: "/student/courses" },
  { icon: "AcademicCapIcon", label: "Lessons", route: "/student/lessons" },
  { icon: "ClipboardDocumentCheckIcon", label: "Assignments", route: "/student/assignments" },
  { icon: "StarIcon", label: "Progress", route: "/student/progress" },
  { icon: "TrophyIcon", label: "Achievements", route: "/student/achievements" },
  { icon: "FireIcon", label: "Streaks", route: "/student/streaks" },
  { icon: "ChatBubbleBottomCenterTextIcon", label: "Community", route: "/student/community" },
  { icon: "CalendarDaysIcon", label: "Schedule", route: "/student/schedule" },
  { icon: "DocumentTextIcon", label: "Notes", route: "/student/notes" },
  { icon: "ArrowTrendingUpIcon", label: "Learning Path", route: "/student/path" },
  { icon: "FolderIcon", label: "Certificates", route: "/student/certificates" },
  { icon: "CreditCardIcon", label: "Payments", route: "/student/payments" },
  { icon: "BellIcon", label: "Notifications", route: "/student/notifications" },
  { icon: "UserCircleIcon", label: "Profile", route: "/student/profile" },
];
</script>

<style scoped>
/* Hide scrollbars but allow vertical scroll */
div.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
div.overflow-y-auto {
  -ms-overflow-style: none; /* IE */
  scrollbar-width: none; /* Firefox */
}
</style>
