<script setup>
import NavigationBar from "@/components/nav/NavigationBar.vue";
</script>

<template>
  <div class="mx-auto h-full min-h-[100vh] w-full max-w-screen-2xl">
    <main class="flex h-full w-full items-center justify-center pt-24">
      <NavigationBar />
      <router-view />
    </main>
  </div>
</template>
