<script setup >

import NavigationBar from "@/components/nav/NavigationBar.vue";
</script>

<template>
  <div class="w-full min-h-[100vh] h-full">
    <main class="w-full h-full flex items-center justify-center pt-16">
      <NavigationBar />
      <div class="h-screen"></div>
      <router-view />
    </main>
  </div>
</template>