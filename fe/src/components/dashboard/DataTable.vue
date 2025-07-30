<script setup>
// 导入自定义的表格相关组件，分别用于表格、表头、表体、表格行、表格单元格等结构化展示数据
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/request.js";
import { ref } from "vue";

const transactionHistory = ref([]);

api
  .get("/cash/account/3")
  .then((response) => {
    transactionHistory.value = response; //.data->.value
    console.log("Dashboard data:", response);
  })
  .catch((error) => {
    console.error("Error fetching dashboard data:", error);
  });
// 定义交易历史数据 transactionHistory，是一个数组，每个对象代表一条交易记录
// 字段说明：
// - date：交易日期
// - type：交易类型或说明
// - amount：交易金额，正数为收入，负数为支出
// - isIncome：布尔值，标记该交易是否为收入
// 格式化日期
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// 根据type获取状态名称
const getTypeName = (type) => {
  // 假设1=收入(Income)，2=支出(Expense)，可根据实际业务调整
  const typeMap = {
    1: "Income",
    2: "Expense",
  };
  return typeMap[type] || "Unknown";
};

// 根据type获取状态样式
const getTypeClass = (type) => {
  return type === 1 ? "text-green-600 font-medium" : "text-red-600 font-medium";
};
</script>

<template>
  <!--
    该模板用于渲染交易历史表格。
    外层 div 增加卡片效果，白色背景、圆角和阴影。
  -->
  <div class="rounded-lg bg-white p-6 shadow-md">
    <Table>
      <TableCaption>A list of your transaction history.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[180px]">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="transaction in transactionHistory"
          :key="transaction.occurred_at"
        >
          <!-- 日期列 - 格式化occurred_at字段 -->
          <TableCell class="font-medium">
            {{ formatDate(transaction.occurred_at) }}
          </TableCell>

          <!-- 状态列 - 转换type字段为文字描述 -->
          <TableCell>
            <span :class="getTypeClass(transaction.type)">
              {{ getTypeName(transaction.type) }}
            </span>
          </TableCell>

          <!-- 描述列 - 使用description字段 -->
          <TableCell>{{ transaction.description }}</TableCell>

          <!-- 金额列 - 显示amount并区分收支 -->
          <TableCell class="text-right">
            <span
              :class="
                transaction.type === 1 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ transaction.type === 1 ? "+" : "-" }} {{ transaction.amount }}
            </span>
          </TableCell>
        </TableRow>

        <!-- 空状态处理 -->
        <TableRow v-if="transactionHistory.length === 0">
          <TableCell :colSpan="4" class="py-8 text-center text-gray-500">
            No transaction history found
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
