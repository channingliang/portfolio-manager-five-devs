<script setup>
import Portfolio from "@/components/dashboard/PortfolioCard.vue";
import PortfolioTransaction from "@/components/dashboard/PortfolioTransaction.vue";
import CashInfo from "@/components/dashboard/CashInfo.vue";
import Overview from "@/components/dashboard/Overview.vue";
import PieChart from "@/components/dashboard/PieChart.vue";
</script>

<template>
  <div class="flex gap-4">
    <!-- 左侧：固定宽度 -->
    <div
      class="sticky top-24 h-[calc(100vh-160px)] max-w-[400px] min-w-[300px] pr-2"
    >
      <CashInfo />
    </div>

    <!-- 中间：自适应 -->
    <div class="min-w-0 flex-1">
      <Portfolio />
    </div>

    <!-- 右侧：固定宽度 -->
    <div class="max-w-[300px] overflow-y-auto">
      <PieChart />
      <Overview />
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
