<template>
  <div class="medium">
    <!-- 标题 -->
    <h3 class="text-primary mb-4 flex items-center text-lg font-bold">
      <span
        class="iconify mr-2"
        data-icon="material-symbols:currency-exchange"
      ></span>
      Portfolio Assets
    </h3>

    <!-- 总资产 -->
    <div class="mb-4 text-2xl font-bold">
      ￥{{ portfolioValue.toLocaleString() }}
    </div>

    <!-- 持仓产品 -->
    <div class="mb-6">
      <h4 class="mb-3 text-sm font-medium text-gray-500">持仓产品</h4>
      <div class="grid grid-cols-2 gap-4">
        <!-- 动态生成产品卡片 -->
        <div
          v-for="(item, index) in holdings"
          :key="index"
          class="group relative rounded-lg border bg-white p-4 transition-shadow hover:shadow-lg"
        >
          <!-- 卡片头部 -->
          <div class="flex justify-between">
            <div class="text-xs font-medium text-gray-800">
              产品名称：
              <br />
              {{ item.name }}
            </div>
            <div
              class="font-mono text-xs"
              :class="item.yield >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              收益率：
              <br />
              {{ item.yield >= 0 ? "+" : "" }}{{ item.yield }}%
            </div>
          </div>

          <!-- 市值 -->
          <div class="mt-2 font-mono text-sm">
            市值：￥{{ item.marketValue.toLocaleString() }}
          </div>

          <!-- Hover显示详情 -->
          <div
            class="absolute top-full left-0 z-10 mt-2 hidden w-full rounded-lg border bg-white p-4 shadow-lg group-hover:block"
          >
            <table class="w-full text-xs">
              <tbody>
                <tr>
                  <td class="py-1 text-gray-500">最新净值</td>
                  <td class="py-1 font-mono">{{ item.nav }}</td>
                </tr>
                <tr>
                  <td class="py-1 text-gray-500">持有份额</td>
                  <td class="py-1 font-mono">
                    {{ item.shares.toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td class="py-1 text-gray-500">年化收益</td>
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

// 模拟持仓数据，可以替换为 API 获取
const portfolioValue = ref(10000000);

const holdings = ref([
  {
    name: "产品A",
    yield: 5.0,
    marketValue: 2500000,
    nav: 3.2567,
    shares: 129857.25,
    annualYield: 12.15,
  },
  {
    name: "产品B",
    yield: -5.0,
    marketValue: 1500000,
    nav: 2.1356,
    shares: 98574.1,
    annualYield: -3.2,
  },
  {
    name: "产品C",
    yield: -5.0,
    marketValue: 3800000,
    nav: 1.8765,
    shares: 189321.4,
    annualYield: 6.5,
  },
  {
    name: "产品D",
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
