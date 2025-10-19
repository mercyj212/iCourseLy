<template>
  <div class="relative flex justify-center w-full">
    <router-link
      :to="route"
      class="group relative flex items-center justify-center w-full"
      ref="iconRef"
      @mouseenter="showTooltip = true; updateTooltipPosition()"
      @mouseleave="showTooltip = false"
    >
      <!-- Icon button -->
      <div
        class="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200"
        :class="isActive ? 'bg-yellow-500/10' : 'bg-transparent hover:bg-white/3'"
      >
        <component
          :is="icons[icon]"
          class="w-6 h-6 text-gray-300 transition-transform duration-200 group-hover:scale-110"
          :class="{ 'text-yellow-400': isActive, 'text-gray-300': !isActive }"
        />
      </div>

      <!-- Active vertical bar -->
      <div
        v-if="isActive"
        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-r-full"
      ></div>
    </router-link>

    <!-- Tooltip rendered via Teleport -->
    <Teleport to="body">
      <div
        v-if="showTooltip"
        class="fixed bg-[#0B0B0F]/95 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg z-[9999] whitespace-nowrap transition-all duration-200"
        :style="tooltipStyles"
      >
        {{ tooltip }}
        <div class="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#0B0B0F]/95"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

/* heroicons (outline) */
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  FolderIcon,
  CreditCardIcon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  icon: { type: String, required: true },
  route: { type: String, default: "#" },
  tooltip: { type: String, default: "" },
});

const route = useRoute();
const isActive = computed(() => route.path === props.route);

const icons = {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  FolderIcon,
  CreditCardIcon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
};

const showTooltip = ref(false);
const iconRef = ref(null);
const tooltipStyles = ref({ top: "0px", left: "0px" });

const updateTooltipPosition = () => {
  if (!iconRef.value) return;
  const rect = iconRef.value.getBoundingClientRect();
  tooltipStyles.value = {
    top: `${rect.top + rect.height / 2}px`,
    left: `${rect.right + 8}px`, // 8px margin to the right
    transform: "translateY(-50%)",
  };
};
</script>
