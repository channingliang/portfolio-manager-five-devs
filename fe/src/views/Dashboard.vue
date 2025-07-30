<script setup>
import HoldingsInfo from "@/components/dashboard/HoldingsInfo.vue";
import PortfolioTransaction from "@/components/dashboard/PortfolioTransaction.vue";
import CashInfo from "@/components/dashboard/CashInfo.vue";
import LineGraph from "@/components/dashboard/LineGraph.vue";
import PieChart from "@/components/dashboard/PieChart.vue";
import GraphsCarousel from "@/components/dashboard/GraphsCarousel.vue";
</script>

<template>
  <div class="flex min-h-screen gap-4">
    <div class="w-[400px]">
      <div class="sticky top-24">
        <CashInfo />
      </div>
    </div>

    <div class="sticky top-24 h-auto min-w-[400px] flex-1">
      <HoldingsInfo />
    </div>

    <div class="w-[400px]">
      <div class="sticky top-24 space-y-4">
        <!--<GraphsCarousel />-->
        <PieChart />
        <LineGraph />
      </div>
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
