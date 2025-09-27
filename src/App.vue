<template>
  <div class="flex">
    <main class="flex-1 bg-black text-white ">
      <RouterView />
    </main>
  </div>
</template>

<script>
  import { RouterView } from 'vue-router'

  export default {
    name: "App",
    components: { RouterView }
  };
</script>
