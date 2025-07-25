<script setup>
import CustomCard from "@/components/dashboard/CustomCard.vue";
import Portfolio from "@/components/dashboard/PortfolioCard.vue";
import PortfolioTransaction from "@/components/dashboard/PortfolioTransaction.vue";
// import api from "@/lib/request.js";

// Example API call to fetch data
// api.get("/posts/1")
//   .then((response) => {
//     console.log("Dashboard data:", response.data);
//   })
//   .catch((error) => {
//     console.error("Error fetching dashboard data:", error);
//   });
</script>

<template>
  <!-- 整体容器，高度占满屏幕 -->
  <div class="flex h-screen flex-col gap-4 bg-gray-100 p-4">
    <!-- 上半部分：三栏，高度固定 -->
    <div class="grid h-[400px] grid-cols-3 gap-4">
      <!-- 左侧 -->
      <div class="overflow-y-auto rounded-lg bg-white p-4 shadow">
        <h2 class="mb-2 text-lg font-bold">Left Panel (待添加组件)</h2>
        <div class="h-[800px]">这里填充内容测试滚动</div>
      </div>

      <!-- 中间：Portfolio Assets -->
      <div class="overflow-y-auto rounded-lg bg-white p-4 shadow">
        <Portfolio />
      </div>

      <!-- 右侧 -->
      <div class="overflow-y-auto rounded-lg bg-white p-4 shadow">
        <h2 class="mb-2 text-lg font-bold">Right Panel (待添加组件)</h2>
        <div class="h-[600px]">这里填充内容测试滚动</div>
      </div>
    </div>

    <!-- 下半部分：交易历史，自适应剩余空间 -->
    <div class="flex-1 overflow-y-auto rounded-lg bg-white p-4 shadow">
      <PortfolioTransaction />
    </div>
  </div>
</template>

<style scoped></style>
