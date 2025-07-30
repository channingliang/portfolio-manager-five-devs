<script setup>
import { ref, onMounted } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import api from "@/lib/request.js";

// 交易数据
const trades = ref([]);
// 加载状态
const isLoading = ref(true);
// 错误信息
const errorMessage = ref("");

// 获取交易数据
const fetchTrades = () => {
  isLoading.value = true;
  errorMessage.value = "";

  // 调用API获取交易记录，这里假设接口路径与现金账户类似
  api
    .get("/portfolio/transaction")
    .then((response) => {
      trades.value = response; // 直接赋值响应数据
      console.log("交易记录数据:", response);
    })
    .catch((error) => {
      console.error("获取交易记录失败:", error);
      errorMessage.value = "加载交易记录失败，请稍后重试";
    })
    .finally(() => {
      isLoading.value = false;
    });
};

// 组件挂载时获取数据
onMounted(() => {
  fetchTrades();
});
</script>

<template>
  <div class="medium w-full">
    <Card class="w-full max-w-full shadow-md">
      <CardHeader>
        <CardTitle class="text-lg text-gray-700">
          Portfolio Transaction
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="p-8 text-center text-gray-500">
          加载中...
        </div>

        <!-- 错误信息 -->
        <div v-else-if="errorMessage" class="p-8 text-center text-red-600">
          {{ errorMessage }}
          <button
            @click="fetchTrades"
            class="mt-2 text-blue-600 hover:underline"
          >
            重试
          </button>
        </div>

        <!-- 交易表格 -->
        <Table v-else class="w-full text-sm">
          <TableHeader class="sticky top-0 z-10 bg-gray-50">
            <TableRow>
              <TableHead class="px-4 py-3 text-left">Date</TableHead>
              <TableHead class="px-4 py-3 text-left">Product</TableHead>
              <TableHead class="px-4 py-3 text-left">Type</TableHead>
              <TableHead class="px-4 py-3 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- 无数据状态 -->
            <TableRow v-if="trades.length === 0">
              <TableCell
                colspan="4"
                class="px-4 py-8 text-center text-gray-500"
              >
                没有找到交易记录
              </TableCell>
            </TableRow>

            <!-- 交易记录 -->
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
