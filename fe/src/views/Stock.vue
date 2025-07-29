<script setup>
import { useAccountStore } from "@/stores/account.js";
import { Button } from "@/components/ui/button/index.js";
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { use } from "echarts/core";
import * as echarts from "echarts";
import api from "@/lib/request.js";

const accountStore = useAccountStore();

const updateBalance = () => {
  accountStore.setBalance(9999999.99);
};

// 用户持仓（股票代码 -> 股数）
const holdings = ref({});

// 模拟股票数据（每个股票附带K线数据）
const generateKLineData = () => {
  const basePrice = 100 + Math.random() * 200;
  const days = 30;
  const categoryData = [];
  const values = [];

  for (let i = 0; i < days; i++) {
    const date = `2024/07/${(i + 1).toString().padStart(2, "0")}`;
    const open = +(basePrice + Math.random() * 20 - 10).toFixed(2);
    const close = +(open + Math.random() * 20 - 10).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * 5).toFixed(2);
    const high = +(Math.max(open, close) + Math.random() * 5).toFixed(2);
    categoryData.push(date);
    values.push([open, close, low, high]);
  }
  return { categoryData, values };
};

const allStocks = ref(
  [
    { code: "AAPL", name: "苹果公司", industry: "科技", price: 175.6 },
    { code: "TSLA", name: "特斯拉", industry: "汽车", price: 225.3 },
    { code: "AMZN", name: "亚马逊", industry: "电商", price: 135.8 },
    { code: "BABA", name: "阿里巴巴", industry: "电商", price: 95.2 },
  ].map((stock) => ({ ...stock, kline: generateKLineData() })),
); // 每个股票生成K线数据

// 搜索逻辑
const searchInput = ref("");
const searchQuery = ref("");

const handleSearch = () => {
  searchQuery.value = searchInput.value.trim();
};

const clearSearch = () => {
  searchInput.value = "";
  searchQuery.value = "";
};

const displayedStocks = computed(() => {
  if (!searchQuery.value) return allStocks.value;
  const keyword = searchQuery.value.toLowerCase();
  return allStocks.value.filter(
    (stock) =>
      stock.name.toLowerCase().includes(keyword) ||
      stock.code.toLowerCase().includes(keyword),
  );
});

// 买卖交易弹窗逻辑
const dialogOpen = ref(false);
const transactionType = ref("buy"); // 'buy' 或 'sell'
const selectedStock = ref(null);

// 输入模式：'shares'（股数）或 'amount'（金额）
const inputMode = ref("shares");
const shares = ref(0);
const amount = ref(0);

const openTransaction = (stock, type) => {
  selectedStock.value = stock;
  transactionType.value = type;
  inputMode.value = "shares";
  shares.value = 0;
  amount.value = 0;
  dialogOpen.value = true;
};

// 计算当前交易金额（用于显示）
const transactionCost = computed(() => {
  if (!selectedStock.value) return 0;
  if (inputMode.value === "shares") {
    return shares.value * selectedStock.value.price;
  } else {
    return amount.value;
  }
});

// 确认交易
const confirmTransaction = () => {
  if (!selectedStock.value) {
    dialogOpen.value = false;
    return;
  }

  const price = selectedStock.value.price;
  let qty = 0;
  let totalCost = 0;

  if (inputMode.value === "shares") {
    qty = shares.value;
    totalCost = qty * price;
  } else {
    totalCost = amount.value;
    qty = Math.floor(amount.value / price);
  }

  if (qty <= 0 || totalCost <= 0) {
    alert("Please enter a valid quantity or amount!");
    return;
  }

  const code = selectedStock.value.code;

  if (transactionType.value === "buy") {
    if (accountStore.balance < totalCost) {
      alert("Insufficient balance, unable to purchase!");
      return;
    }
    accountStore.balance -= totalCost;
    holdings.value[code] = (holdings.value[code] || 0) + qty;
  } else {
    if ((holdings.value[code] || 0) < qty) {
      alert("Insufficient position, unable to sell!");
      return;
    }
    accountStore.balance += totalCost;
    holdings.value[code] -= qty;
  }

  dialogOpen.value = false;
};

// 计算持仓详情（过滤掉股数为 0 的）
const holdingsList = computed(() => {
  return Object.entries(holdings.value)
    .filter(([_, qty]) => qty > 0) // 只保留大于 0 的持仓
    .map(([code, qty]) => {
      const stock = allStocks.value.find((s) => s.code === code);
      return {
        code,
        name: stock?.name || "未知",
        price: stock?.price || 0,
        quantity: qty,
        total: (stock?.price || 0) * qty,
      };
    });
});

// 展开行逻辑
const expandedStock = ref(null);
const toggleExpand = async (code) => {
  expandedStock.value = expandedStock.value === code ? null : code;
  await nextTick();
  if (expandedStock.value) {
    initKLineChart(code);
  }
};

// 初始化ECharts
const initKLineChart = (code) => {
  const stock = allStocks.value.find((s) => s.code === code);
  if (!stock) return;

  const chartDom = document.getElementById(`kline-${code}`);
  if (!chartDom) return;

  const chart = echarts.init(chartDom);
  const upColor = "#ec0000";
  const upBorderColor = "#8A0000";
  const downColor = "#00da3c";
  const downBorderColor = "#008F28";

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
    grid: { left: "10%", right: "10%", bottom: "15%" },
    xAxis: {
      type: "category",
      data: stock.kline.categoryData,
      boundaryGap: false,
      axisLine: { onZero: false },
    },
    yAxis: { scale: true },
    series: [
      {
        type: "candlestick",
        name: code,
        data: stock.kline.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor,
        },
      },
    ],
  };
  chart.setOption(option);
};
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50">
    <!-- 更新余额按钮 -->
    <div class="flex justify-end p-4">
      <Button
        class="text- black bg-blue-600 hover:bg-blue-700"
        @click="updateBalance"
      >
        Refresh Balance
      </Button>
    </div>

    <div class="mx-auto max-w-6xl space-y-10 p-6">
      <!-- 页面标题 -->
      <h1 class="mb-2 text-3xl font-bold text-gray-800">Stock Market</h1>
      <p class="text-gray-500">
        Browse, search, and trade your favorite stocks
      </p>

      <!-- 搜索栏 -->
      <div class="sticky top-16 z-10 flex gap-3 rounded-lg bg-white p-4 shadow">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Enter stock name or code"
          class="flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          @keyup.enter="handleSearch"
        />
        <Button
          @click="handleSearch"
          class="rounded-lg bg-blue-500 px-4 text-gray-700 hover:bg-blue-600"
        >
          Search
        </Button>
        <Button
          @click="clearSearch"
          class="rounded-lg bg-gray-200 px-4 text-gray-700 hover:bg-gray-300"
        >
          Clear
        </Button>
      </div>

      <!-- 我的持仓 -->
      <Card class="w-full rounded-xl shadow-md">
        <CardContent>
          <h2 class="mb-4 text-xl font-semibold text-gray-800">My Holdings</h2>
          <div v-if="holdingsList.length > 0">
            <Table class="w-full">
              <TableHeader>
                <TableRow class="bg-gray-100">
                  <TableHead>Stock Code</TableHead>
                  <TableHead>Stock Name</TableHead>
                  <TableHead class="text-right">Quantity</TableHead>
                  <TableHead class="text-right">Price</TableHead>
                  <TableHead class="text-right">Total</TableHead>
                  <TableHead class="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="item in holdingsList"
                  :key="item.code"
                  class="hover:bg-gray-50"
                  :class="{
                    'bg-gray-50': holdingsList.indexOf(item) % 2 === 1,
                  }"
                >
                  <TableCell>{{ item.code }}</TableCell>
                  <TableCell>{{ item.name }}</TableCell>
                  <TableCell class="text-right font-mono">{{
                    item.quantity
                  }}</TableCell>
                  <TableCell class="text-right font-mono"
                    >${{ item.price }}</TableCell
                  >
                  <TableCell class="text-right font-mono"
                    >${{ item.total.toFixed(2) }}</TableCell
                  >
                  <TableCell class="text-center">
                    <Button
                      class="bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90"
                      @click="
                        openTransaction(
                          {
                            code: item.code,
                            name: item.name,
                            price: item.price,
                          },
                          'sell',
                        )
                      "
                    >
                      Sell
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-gray-500">No positions held</div>
        </CardContent>
      </Card>

      <!-- 股票市场表格 -->
      <Card>
        <CardContent>
          <h2 class="mb-4 text-xl font-bold text-gray-800">Available Stocks</h2>
          <Table class="w-full">
            <TableHeader>
              <TableRow class="bg-gray-100">
                <TableHead class="text-center">Code</TableHead>
                <TableHead class="text-center">Name</TableHead>
                <TableHead class="text-center">Industry</TableHead>
                <TableHead class="text-center">Price</TableHead>
                <TableHead class="text-center">Action</TableHead>
                <TableHead class="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-for="stock in displayedStocks" :key="stock.code">
                <!-- 点击整行也可以展开/收起 -->
                <TableRow
                  class="cursor-pointer hover:bg-gray-50"
                  @click="toggleExpand(stock.code)"
                >
                  <TableCell class="text-center">{{ stock.code }}</TableCell>
                  <TableCell class="text-center">{{ stock.name }}</TableCell>
                  <TableCell class="text-center">{{
                    stock.industry
                  }}</TableCell>
                  <TableCell class="text-center">${{ stock.price }}</TableCell>
                  <TableCell class="text-center">
                    <Button
                      class="bg-gradient-to-r from-green-500 to-green-600 text-white"
                      @click.stop="openTransaction(stock, 'buy')"
                    >
                      Buy
                    </Button>
                  </TableCell>
                  <TableCell class="text-center">
                    <!-- 箭头也能展开，但不冒泡到行 -->
                    <span
                      class="cursor-pointer text-lg text-black select-none"
                      @click.stop="toggleExpand(stock.code)"
                    >
                      {{ expandedStock === stock.code ? "▲" : "▼" }}
                    </span>
                  </TableCell>
                </TableRow>

                <!-- 展开详情行 -->
                <TableRow v-if="expandedStock === stock.code">
                  <TableCell colspan="6">
                    <div
                      :id="`kline-${stock.code}`"
                      style="height: 300px"
                    ></div>
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
          <div
            v-if="displayedStocks.length === 0"
            class="mt-6 text-center text-gray-500"
          >
            No stocks found
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 买卖股票弹窗 -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-w-md rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle class="text-xl font-semibold">
            {{ transactionType === "buy" ? "Buy" : "Sell" }}
            {{ selectedStock?.name }} ({{ selectedStock?.code }})
          </DialogTitle>
        </DialogHeader>

        <!-- 输入模式切换 -->
        <div class="mb-4 flex gap-4">
          <Button
            variant="outline"
            :class="inputMode === 'shares' ? 'bg-gray-100' : ''"
            @click="inputMode = 'shares'"
          >
            By Quantity
          </Button>
          <Button
            variant="outline"
            :class="inputMode === 'amount' ? 'bg-gray-100' : ''"
            @click="inputMode = 'amount'"
          >
            By Amount
          </Button>
        </div>

        <!-- 输入框 -->
        <Input
          v-if="inputMode === 'shares'"
          type="number"
          min="1"
          :value="shares"
          @input="(e) => (shares = Number(e.target.value))"
          placeholder="Enter quantity"
          class="mb-3"
        />
        <Input
          v-else
          type="number"
          min="1"
          :value="amount"
          @input="(e) => (amount = Number(e.target.value))"
          placeholder="Enter amount"
          class="mb-3"
        />

        <!-- 动态交易金额 -->
        <p class="font-semibold text-gray-600">
          Estimated Cost:
          <span class="text-blue-600">${{ transactionCost.toFixed(2) }}</span>
        </p>

        <!-- 操作按钮 -->
        <DialogFooter class="mt-4">
          <Button
            @click="dialogOpen = false"
            class="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            @click="confirmTransaction"
            :class="
              transactionType === 'buy'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90'
            "
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
