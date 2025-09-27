<template>
  <div
    class="rotate-90 group flex flex-col items-center justify-start
           cursor-pointer bg-black text-white
           transition-all duration-500 overflow
           h-10 hover:h-20 w-10 text-xs"
  >
    <!-- Roman numeral -->
     
    <span class="font-bold text-gray-500">{{ numeral }}</span>
   

    <!-- Label (revealed below numeral on hover) -->
    <span
      class="absolute left-10 text-white/60 text-xs mt-1 opacity-0 
             group-hover:opacity-100  duration-700 uppercase font-bold transform transition-transform hover:scale-x-110"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  numeral: String,
  label: String,
})
</script>
