<script setup>
import HoldingsInfo from "@/components/dashboard/HoldingsInfo.vue";
import PortfolioTransaction from "@/components/dashboard/PortfolioTransaction.vue";
import CashInfo from "@/components/dashboard/CashInfo.vue";
import LineGraph from "@/components/dashboard/LineGraph.vue";
import PieChart from "@/components/dashboard/PieChart.vue";
import GraphsCarousel from "@/components/dashboard/GraphsCarousel.vue";
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
    <div class="sticky top-24 h-auto flex-1">
      <HoldingsInfo />
    </div>

    <!-- 右侧：固定宽度 -->
    <div class="sticky top-24 max-w-[500px] min-w-[400px]">
      <!--<PieChart />-->
      <!--<LineGraph />-->
      <GraphsCarousel />
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
