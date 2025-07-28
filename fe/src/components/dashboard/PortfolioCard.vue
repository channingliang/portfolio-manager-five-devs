<template>
  <div class="medium">
    <!-- 标题 -->
    <!-- 标题 -->
    <h2 class="mb-4 text-xl font-semibold text-gray-900">Account Overview</h2>
    <h3 class="text-primary mb-4 flex items-center text-lg font-bold"></h3>

    <!-- 投资资产行 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- 投资资产图标 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-600"
        >
          <!-- 三个柱状条 -->
          <rect x="3" y="10" width="4" height="11" rx="1"></rect>
          <rect x="10" y="6" width="4" height="15" rx="1"></rect>
          <rect x="17" y="2" width="4" height="19" rx="1"></rect>
        </svg>
        <span class="text-gray-600">Portfolio Assets</span>
      </div>

      <!-- 金额 -->
      <div class="text-2xl font-bold text-gray-900">
        ￥{{ portfolioValue.toLocaleString() }}
      </div>
    </div>

    <!-- 持仓产品 -->
    <div class="mb-6">
      <div class="grid grid-cols-2 gap-4">
        <!-- 动态生成产品卡片 -->
        <div
          v-for="(item, index) in holdings"
          :key="index"
          class="relative rounded-lg border bg-white p-4 transition-shadow hover:shadow-lg"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = null"
        >
          <!-- 卡片头部 -->
          <div class="flex justify-between">
            <div class="text-xs font-medium text-gray-800">
              Product Name:
              <br />
              {{ item.name }}
            </div>
            <div
              class="font-mono text-xs"
              :class="item.yield >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              Yield rate:
              <br />
              {{ item.yield >= 0 ? "+" : "" }}{{ item.yield }}%
            </div>
          </div>

          <!-- 市值 -->
          <div class="mt-2 font-mono text-sm">
            Market capitalization: ￥{{ item.marketValue.toLocaleString() }}
          </div>

          <!-- Hover显示详情：只显示当前悬停的卡片 -->
          <div
            v-if="hoverIndex === index"
            class="absolute top-full left-0 z-10 mt-2 w-full rounded-lg border bg-white p-4 shadow-lg"
          >
            <table class="w-full text-xs">
              <tbody>
                <tr>
                  <td class="py-1 text-gray-500">Latest net value</td>
                  <td class="py-1 font-mono">{{ item.nav }}</td>
                </tr>
                <tr>
                  <td class="py-1 text-gray-500">Holding shares</td>
                  <td class="py-1 font-mono">
                    {{ item.shares.toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1 text-gray-500">Annualized return</td>
                  <td
                    class="py-1 font-mono"
                    :class="
                      item.annualYield >= 0 ? 'text-green-600' : 'text-red-600'
                    "
                  >
                    {{ item.annualYield >= 0 ? "+" : ""
                    }}{{ item.annualYield }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// 当前悬停的卡片索引
const hoverIndex = ref(null);

// 模拟持仓数据，可以替换为 API 获取
const portfolioValue = ref(10000000);

const holdings = ref([
  {
    name: "Product A",
    yield: 5.0,
    marketValue: 2500000,
    nav: 3.2567,
    shares: 129857.25,
    annualYield: 12.15,
  },
  {
    name: "Product B",
    yield: -5.0,
    marketValue: 1500000,
    nav: 2.1356,
    shares: 98574.1,
    annualYield: -3.2,
  },
  {
    name: "Product C",
    yield: -5.0,
    marketValue: 3800000,
    nav: 1.8765,
    shares: 189321.4,
    annualYield: 6.5,
  },
  {
    name: "Product D",
    yield: -5.0,
    marketValue: 2200000,
    nav: 3.4521,
    shares: 115632.2,
    annualYield: 8.3,
  },
]);
</script>

<style scoped>
.medium {
  padding: 20px;
  height: 100%;
  overflow-y: auto; /* 允许滚动 */
}
</style>
