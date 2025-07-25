<script setup>
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// 模拟交易数据，可替换为 API 获取
const trades = ref([
  { date: '07/22', product: '黄金ETF', type: '买入', amount: -158200.0 },
  { date: '07/19', product: '景顺新兴成长', type: '分红', amount: 12560.0 },
  { date: '07/15', product: '上证50指数', type: '卖出', amount: 218560.0 },
  { date: '07/08', product: '中债国债30', type: '买入', amount: -203400.0 },
  { date: '07/01', product: '货币基金', type: '赎回', amount: 85600.0 },
])
</script>

<template>
  <div class="w-full" medium>
  <Card class="w-full max-w-full shadow-md rounded-2xl">
    <CardHeader>
      <CardTitle class="text-gray-700 text-lg">Portfolio Transaction</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left py-3 px-4">日期</th>
            <th class="text-left py-3 px-4">产品</th>
            <th class="text-left py-3 px-4">类型</th>
            <th class="text-right py-3 px-4">金额</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(trade, index) in trades"
            :key="index"
            :class="index % 2 === 1 ? 'bg-gray-50' : ''"
          >
            <td class="py-3 px-4">{{ trade.date }}</td>
            <td class="py-3 px-4">{{ trade.product }}</td>
            <td class="py-3 px-4">{{ trade.type }}</td>
            <td
              class="py-3 px-4 text-right font-mono"
              :class="trade.amount < 0 ? 'text-red-600' : 'text-green-600'"
            >
              {{ trade.amount < 0 ? '-' : '+' }}{{ Math.abs(trade.amount).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </CardContent>
  </Card>
  </div>
</template>

<style scoped>
.medium {
  padding: 20px;
  height: 100%;
  overflow-y: auto; /* 允许滚动 */
}
</style>