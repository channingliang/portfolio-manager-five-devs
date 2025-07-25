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
  <div class="h-screen flex flex-col gap-4 p-4 bg-gray-100">
    <!-- 上半部分：三栏，高度固定 -->
    <div class="grid grid-cols-3 gap-4 h-[400px]">
      <!-- 左侧 -->
      <div class="bg-white rounded-lg shadow p-4 overflow-y-auto">
        <h2 class="font-bold text-lg mb-2">Left Panel (待添加组件)</h2>
        <div class="h-[800px]">这里填充内容测试滚动</div>
      </div>

      <!-- 中间：Portfolio Assets -->
      <div class="bg-white rounded-lg shadow p-4 overflow-y-auto">
        <Portfolio />
      </div>

      <!-- 右侧 -->
      <div class="bg-white rounded-lg shadow p-4 overflow-y-auto">
        <h2 class="font-bold text-lg mb-2">Right Panel (待添加组件)</h2>
        <div class="h-[600px]">这里填充内容测试滚动</div>
      </div>
    </div>

    <!-- 下半部分：交易历史，自适应剩余空间 -->
    <div class="flex-1 bg-white rounded-lg shadow p-4 overflow-y-auto">
      <PortfolioTransaction />
    </div>
  </div>
</template>

<style scoped></style>
