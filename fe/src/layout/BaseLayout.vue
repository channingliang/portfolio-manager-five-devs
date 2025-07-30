<script setup>
import NavigationBar from "@/components/nav/NavigationBar.vue";
</script>

<template>
  <div
    class="mx-auto flex h-full min-h-[100vh] w-full max-w-screen-2xl justify-center px-16"
  >
    <NavigationBar />
    <main class="h-full w-full pt-24">
      <router-view />
    </main>
  </div>
</template>
