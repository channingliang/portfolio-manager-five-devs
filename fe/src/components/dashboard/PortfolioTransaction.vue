<script setup>
import { ref } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// 模拟交易数据，可替换为 API 获取
const trades = ref([
  { date: "07/22", product: "黄金ETF", type: "买入", amount: -158200.0 },
  { date: "07/19", product: "景顺新兴成长", type: "分红", amount: 12560.0 },
  { date: "07/15", product: "上证50指数", type: "卖出", amount: 218560.0 },
  { date: "07/08", product: "中债国债30", type: "买入", amount: -203400.0 },
  { date: "07/01", product: "货币基金", type: "赎回", amount: 85600.0 },
]);
</script>

<template>
  <div class="medium w-full">
    <Card class="w-full max-w-full rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle class="text-lg text-gray-700">
          Portfolio Transaction
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <!-- 使用 shadcn-vue Table -->
        <Table class="w-full text-sm">
          <TableHeader class="sticky top-0 z-10 bg-gray-50">
            <TableRow>
              <TableHead class="px-4 py-3 text-left">Date</TableHead>
              <TableHead class="px-4 py-3 text-left">Product</TableHead>
              <TableHead class="px-4 py-3 text-left">Type</TableHead>
              <TableHead class="px-4 py-3 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(trade, index) in trades"
              :key="index"
              :class="index % 2 === 1 ? 'bg-gray-50' : ''"
            >
              <TableCell class="px-4 py-3">{{ trade.date }}</TableCell>
              <TableCell class="px-4 py-3">{{ trade.product }}</TableCell>
              <TableCell class="px-4 py-3">{{ trade.type }}</TableCell>
              <TableCell
                class="px-4 py-3 text-right font-mono"
                :class="trade.amount < 0 ? 'text-red-600' : 'text-green-600'"
              >
                {{ trade.amount < 0 ? "-" : "+" }}
                {{ Math.abs(trade.amount).toLocaleString() }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
