<script setup>
import Portfolio from "@/components/dashboard/PortfolioCard.vue";
import PortfolioTransaction from "@/components/dashboard/PortfolioTransaction.vue";
import DataTable from "@/components/dashboard/DataTable.vue";
import LitCard from "@/components/dashboard/LitCard.vue";
import Overview from "@/components/dashboard/Overview.vue";
import PieChart from "@/components/dashboard/PieChart.vue";
</script>

<template>
  <!-- 整体容器，高度占满屏幕 -->
  <div class="flex flex-col gap-8">
    <!-- 上半部分：三栏，高度固定 -->
    <div class="grid grid-cols-3 gap-8">
      <!-- 左侧 -->
      <div class="overflow-y-auto p-6">
        <LitCard />
        <DataTable />
      </div>

      <!-- 中间：Portfolio Assets -->
      <div class="overflow-y-auto p-6">
        <Portfolio />
      </div>

      <!-- 右侧 -->
      <div class="overflow-y-auto p-6">
        <PieChart />
        <Overview />
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
