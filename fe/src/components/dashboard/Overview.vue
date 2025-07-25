<template>
  <div class="w-full rounded-lg bg-white p-6 shadow">
    <h3 class="mb-6 text-lg font-semibold text-gray-800">Portfolio Overview</h3>

    <!-- 统计卡片 -->
    <div class="mb-8 grid grid-cols-3 gap-4">
      <div class="rounded-lg bg-gray-50 p-4">
        <p class="mb-1 text-sm text-gray-500">Total Investments</p>
        <p class="text-xl font-bold text-gray-800">35,360</p>
      </div>
      <div class="rounded-lg bg-gray-50 p-4">
        <p class="mb-1 text-sm text-gray-500">Profitable Trades</p>
        <p class="text-xl font-bold text-green-600">2,570</p>
      </div>
      <div class="rounded-lg bg-gray-50 p-4">
        <p class="mb-1 text-sm text-gray-500">Loss Making Trades</p>
        <p class="text-xl font-bold text-red-600">1,590</p>
      </div>
    </div>

    <!-- 折线图区域 -->
    <div>
      <p class="mb-2 text-sm font-medium text-gray-700">
        Portfolio Value Over Time
      </p>
      <!-- 简化的折线图占位 -->
      <div class="flex h-48 items-end rounded-lg bg-gray-50 p-2">
        <div class="flex flex-1 items-end space-x-1">
          <div
            v-for="(value, index) in chartData"
            :key="index"
            class="w-8 rounded-t-sm bg-blue-500"
            :style="{ height: `${value}%` }"
          ></div>
        </div>
      </div>
      <!-- 时间轴 -->
      <div class="mt-2 flex justify-between px-2 text-xs text-gray-500">
        <span>Mar 2022</span>
        <span>May 2022</span>
        <span>Jul 2022</span>
        <span>Sep 2022</span>
        <span>Nov 2022</span>
        <span>Jan 2023</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PortfolioOverview",
  data() {
    return {
      chartData: [30, 60, 40, 80, 50, 70, 90], // 简化的图表数据
    };
  },
};
</script>
