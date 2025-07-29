<script setup >

import NavigationBar from "@/components/nav/NavigationBar.vue";
</script>

<template>
  <div class="w-full max-w-screen-2xl min-h-[100vh] h-full mx-auto">
    <main class="w-full h-full flex items-center justify-center pt-24">
      <NavigationBar />
      <router-view />
    </main>
  </div>
</template>