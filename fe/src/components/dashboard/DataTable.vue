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

// 定义交易历史数据 transactionHistory，是一个数组，每个对象代表一条交易记录
// 字段说明：
// - date：交易日期
// - type：交易类型或说明
// - amount：交易金额，正数为收入，负数为支出
// - isIncome：布尔值，标记该交易是否为收入
const transactionHistory = [
  {
    date: "07/23",
    type: "工资入账",
    amount: 28560.0,
    isIncome: true,
  },
  {
    date: "07/18",
    type: "基金赎回",
    amount: 52300.0,
    isIncome: true,
  },
  {
    date: "07/15",
    type: "股票购买",
    amount: -36200.0,
    isIncome: false,
  },
  {
    date: "07/10",
    type: "信用卡还款",
    amount: -8556.8,
    isIncome: false,
  },
];
</script>

<template>
  <!--
    该模板用于渲染交易历史表格。
    外层 div 增加卡片效果，白色背景、圆角和阴影。
  -->
  <div class="rounded-lg bg-white p-6 shadow">
    <Table>
      <TableCaption>A list of your transaction history.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]"> date </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right"> Amount </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="invoice in transactionHistory" :key="invoice.date">
          <TableCell class="font-medium">
            {{ invoice.date }}
          </TableCell>
          <TableCell>{{ invoice.type }}</TableCell>
          <TableCell>{{ invoice.isIncome ? "Income" : "Expense" }}</TableCell>
          <TableCell class="text-right">
            {{ invoice.amount }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
