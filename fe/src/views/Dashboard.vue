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
  <div
    class="to-grey-100 flex h-screen flex-col gap-4 bg-gradient-to-b from-gray-50 p-6"
  >
    <!-- 上半部分：三栏，高度固定 -->
    <div class="grid h-[400px] grid-cols-3 gap-4">
      <!-- 左侧 -->
      <div
        class="group via-sky-10 from-grey-50 to-grey-100 overflow-y-auto rounded-2xl bg-gradient-to-br p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl"
      >
        <h2 class="mb-2 text-lg font-bold">Left Panel (待添加组件)</h2>
        <div class="h-[800px]">这里填充内容测试滚动</div>
      </div>

      <!-- 中间：Portfolio Assets -->
      <div
        class="group via-sky-10 from-grey-50 to-grey-100 overflow-y-auto rounded-2xl bg-gradient-to-br p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl"
      >
        <Portfolio />
      </div>

      <!-- 右侧 -->
      <div
        class="group from-grey-50 to-grey-100 overflow-y-auto rounded-2xl bg-gradient-to-br p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl"
      >
        <h2 class="mb-2 text-lg font-bold">Right Panel (待添加组件)</h2>
        <div class="h-[600px]">这里填充内容测试滚动</div>
      </div>
    </div>

    <!-- 下半部分：交易历史，自适应剩余空间 -->
    <div
      class="group via-sky-10 from-grey-50 to-grey-100 flex-1 overflow-y-auto rounded-lg bg-gradient-to-br p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl"
    >
      <PortfolioTransaction />
    </div>
  </div>
</template>

<style scoped>
/* 滚动条美化：简洁细线风格 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.2);
  border-radius: 3px;
}
</style>
