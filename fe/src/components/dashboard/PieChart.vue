<template>
  <div class="mx-auto w-full max-w-md  p-6">
    <h3 class="mb-4 text-lg font-semibold text-gray-800">Portfolio Analysis</h3>

    <!-- 环形图容器 -->
    <div class="relative mx-auto mb-6 h-48 w-48">
      <svg width="100%" height="100%" viewBox="0 0 100 100" class="absolute">
        <!-- 固定收益部分 (57.1%) - 蓝色 -->
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3B82F6"
          stroke-width="8"
          :stroke-dasharray="`${fixedIncomeLength} ${totalLength - fixedIncomeLength}`"
          stroke-dashoffset="0"
          class="transition-opacity duration-300"
          :class="{
            'opacity-70': hoveredSegment && hoveredSegment !== 'fixedIncome',
          }"
          @mouseenter="hoveredSegment = 'fixedIncome'"
          @mouseleave="hoveredSegment = null"
        />

        <!-- 股权投资部分 (42.9%) - 橙色 -->
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#F97316"
          stroke-width="8"
          :stroke-dasharray="`${equityLength} ${totalLength - equityLength}`"
          :stroke-dashoffset="`-${fixedIncomeLength}`"
          class="transition-opacity duration-300"
          :class="{
            'opacity-70': hoveredSegment && hoveredSegment !== 'equity',
          }"
          @mouseenter="hoveredSegment = 'equity'"
          @mouseleave="hoveredSegment = null"
        />

        <!-- 商品投资部分 (8%) - 绿色 -->
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#22C55E"
          stroke-width="8"
          :stroke-dasharray="`${commodityLength} ${totalLength - commodityLength}`"
          :stroke-dashoffset="`-${fixedIncomeLength + equityLength}`"
          class="transition-opacity duration-300"
          :class="{
            'opacity-70': hoveredSegment && hoveredSegment !== 'commodity',
          }"
          @mouseenter="hoveredSegment = 'commodity'"
          @mouseleave="hoveredSegment = null"
        />
      </svg>

      <!-- 中心文字 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <p class="text-sm text-gray-500">Currently Selected</p>
          <p class="text-lg font-semibold">
            {{ hoveredSegment ? segmentNames[hoveredSegment] : "All" }}
          </p>
          <p class="text-sm" :class="getSegmentColor(hoveredSegment)">
            {{ hoveredSegment ? data[hoveredSegment] + "%" : "100%" }}
          </p>
        </div>
      </div>

      <!-- 直接在环形图上显示百分比 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="pointer-events-none text-center">
          <!-- 固定收益百分比 (57.1%) -->
          <div
            class="absolute text-xs font-medium text-blue-500"
            style="
              transform: rotate(-30deg) translate(35px) rotate(30deg);
              transform-origin: center;
            "
          ></div>

          <!-- 股权投资百分比 (42.9%) -->
          <div
            class="absolute text-xs font-medium text-orange-500"
            style="
              transform: rotate(90deg) translate(35px) rotate(-90deg);
              transform-origin: center;
            "
          ></div>

          <!-- 商品投资百分比 (8%) -->
          <div
            class="absolute text-xs font-medium text-green-500"
            style="
              transform: rotate(210deg) translate(35px) rotate(-210deg);
              transform-origin: center;
            "
          ></div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="space-y-2">
      <div
        class="flex items-center rounded p-2 transition-colors duration-200"
        :class="{ 'bg-blue-50': hoveredSegment === 'fixedIncome' }"
        @mouseenter="hoveredSegment = 'fixedIncome'"
        @mouseleave="hoveredSegment = null"
      >
        <div class="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
        <span class="text-sm text-gray-600">Cash: 50%</span>
      </div>
      <div
        class="flex items-center rounded p-2 transition-colors duration-200"
        :class="{ 'bg-orange-50': hoveredSegment === 'equity' }"
        @mouseenter="hoveredSegment = 'equity'"
        @mouseleave="hoveredSegment = null"
      >
        <div class="mr-2 h-4 w-4 rounded-full bg-orange-500"></div>
        <span class="text-sm text-gray-600">Stock Investments: 42%</span>
      </div>
      <div
        class="flex items-center rounded p-2 transition-colors duration-200"
        :class="{ 'bg-green-50': hoveredSegment === 'commodity' }"
        @mouseenter="hoveredSegment = 'commodity'"
        @mouseleave="hoveredSegment = null"
      >
        <div class="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
        <span class="text-sm text-gray-600">Fund Investments: 8%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const hoveredSegment = ref(null);

const data = {
  fixedIncome: 50,
  equity: 42,
  commodity: 8, // 调整为8%
};

const segmentNames = {
  fixedIncome: "Cash",
  equity: "Stock Investments",
  commodity: "Fund Investments",
};

// 计算圆环各部长度
const circumference = 2 * Math.PI * 40; // 2πr ≈ 251.2
const totalLength = circumference;

const fixedIncomeLength = computed(
  () => (data.fixedIncome / 100) * circumference,
);
const equityLength = computed(() => (data.equity / 100) * circumference);
const commodityLength = computed(() => (data.commodity / 100) * circumference);

function getSegmentColor(segment) {
  return {
    "text-blue-500": segment === "fixedIncome",
    "text-orange-500": segment === "equity",
    "text-green-500": segment === "commodity",
    "text-gray-500": !segment,
  };
}
</script>
