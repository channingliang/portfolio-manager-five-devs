<script setup>
import { useAccountStore } from "@/stores/account.js";
import { Button } from "@/components/ui/button/index.js";
import { ref, computed, onMounted, nextTick } from "vue";
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
import * as echarts from "echarts";
import api from "@/lib/request.js";

const accountStore = useAccountStore();

// 刷新余额按钮（测试用）
const updateBalance = () => {
  accountStore.setBalance(9999999.99);
};

// 用户持仓（股票代码 -> 股数）
const holdings = ref({});

// 股票列表（API获取）
const allStocks = ref([]);

// 搜索逻辑
const searchInput = ref("");
const searchQuery = ref("");
const loading = ref(false);
const processMessage = ref("");

// const handleSearch = () => {
//   searchQuery.value = searchInput.value.trim();
//   if (!searchQuery.value) return;

//   loading.value = true;
//   api
//     .post("/tiingo", {
//       ticker: searchQuery.value,
//       startDate: "2025-01-01T00:00:00.000Z",
//       endDate: "2025-07-28T23:59:59.999Z",
//       sort: "DESC",
//     })
//     .then((res) => {
//       allStocks.value = (res || []).map((item) => ({
//         ticker: item.ticker,
//         name: item.name,
//         price: "--", // 等待 EOD 数据填充
//         kline: [],
//       }));
//       // 拉取每只股票最新价格
//       allStocks.value.forEach((stock) => fetchEODData(stock, true));
//     })
//     .catch((e) => {
//       processMessage.value = e?.message || "Search failed.";
//       console.error("Search error:", e);
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// };

// 使用 mock 数据模拟搜索
import { mockCryptos } from "@/lib/api.js";

const handleSearch = () => {
  searchQuery.value = searchInput.value.trim();
  if (!searchQuery.value) return;

  loading.value = true;

  // 模拟 API 查询逻辑
  setTimeout(() => {
    // 模拟根据 searchQuery 过滤
    const result = mockCryptos.filter((stock) =>
      stock.ticker.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );

    allStocks.value = result.map((item) => ({
      ticker: item.ticker,
      name: item.name,
      price: item.price || "--", // 直接用 mock 数据价格
      kline: [], // 如果要的话，也可以用之前的 generatePriceSeries 填充
    }));

    // 如果还想模拟拉取 EOD 数据，可以在这里直接调用 fetchEODData
    allStocks.value.forEach((stock) => fetchEODData(stock, true));

    loading.value = false;
  }, 500); // 用 setTimeout 模拟网络延迟
};

const clearSearch = () => {
  searchInput.value = "";
  searchQuery.value = "";
};

// 显示列表
const displayedStocks = computed(() => allStocks.value);

// 获取 EOD 数据：用于价格和 K 线
// const fetchEODData = (stock, onlyPrice = false) => {
//   api
//     .post("/tiingo", {
//       ticker: searchQuery.value,
//       startDate: "2025-01-01T00:00:00.000Z",
//       endDate: "2025-07-28T23:59:59.999Z",
//       sort: "DESC",
//     })
//     .then((res) => {
//       if (!res?.length) return;
//       const last = res[res.length - 1];
//       stock.price = last.close?.toFixed(2) ?? "--";
//       if (!onlyPrice) {
//         stock.kline = res.map((d) => ({
//           date: d.date.slice(0, 10),
//           open: d.open,
//           close: d.close,
//           low: d.low,
//           high: d.high,
//         }));
//         drawKLine(stock);
//       }
//     })
//     .catch((e) => {
//       console.error(`EOD fetch error for ${stock.ticker}:`, e);
//     });
//};

// 使用 mock 数据模拟 EOD 数据获取
import { cryptoPrices } from "@/lib/api.js";

const fetchEODData = (stock, onlyPrice = false) => {
  const mock = cryptoPrices.find((s) => s.ticker === stock.ticker);
  if (!mock) return;

  const res = mock.priceHistory;
  const last = res[res.length - 1];

  stock.price = last.close?.toFixed(2) ?? "--";
  if (!onlyPrice) {
    stock.kline = res.map((d) => ({
      date: d.date,
      open: d.open,
      close: d.close,
      low: d.low,
      high: d.high,
    }));
    drawKLine(stock);
  }
};

// 绘制K线
const drawKLine = (stock) => {
  const dom = document.getElementById(`kline-${stock.ticker}`);
  if (!dom) return;
  const chart = echarts.init(dom);
  const dates = stock.kline.map((d) => d.date);
  const values = stock.kline.map((d) => [d.open, d.close, d.low, d.high]);
  chart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: dates, boundaryGap: false },
    yAxis: { scale: true },
    series: [
      {
        type: "candlestick",
        data: values,
      },
    ],
  });
};

// 展开行逻辑
const expandedStock = ref(null);
const toggleExpand = (ticker) => {
  expandedStock.value = expandedStock.value === ticker ? null : ticker;
  if (expandedStock.value) {
    const stock = allStocks.value.find((s) => s.ticker === ticker);
    if (stock && !stock.kline.length) {
      fetchEODData(stock);
    } else {
      nextTick(() => drawKLine(stock));
    }
  }
};

// 买卖交易逻辑
const dialogOpen = ref(false);
const transactionType = ref("buy");
const selectedStock = ref(null);
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

const transactionCost = computed(() => {
  if (!selectedStock.value) return 0;
  return inputMode.value === "shares"
    ? shares.value * selectedStock.value.price
    : amount.value;
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

  const ticker = selectedStock.value.ticker;

  if (transactionType.value === "buy") {
    if (accountStore.balance < totalCost) {
      alert("Insufficient balance!");
      return;
    }
    accountStore.balance -= totalCost;
    holdings.value[ticker] = (holdings.value[ticker] || 0) + qty;
  } else {
    if ((holdings.value[ticker] || 0) < qty) {
      alert("Not enough shares to sell!");
      return;
    }
    accountStore.balance += totalCost;
    holdings.value[ticker] -= qty;
  }
  dialogOpen.value = false;
};

// 计算持仓列表
const holdingsList = computed(() => {
  return Object.entries(holdings.value)
    .filter(([_, qty]) => qty > 0)
    .map(([ticker, qty]) => {
      const stock = allStocks.value.find((s) => s.ticker === ticker);
      return {
        ticker,
        name: stock?.name || "Unknown",
        price: stock?.price || 0,
        quantity: qty,
        total: (stock?.price || 0) * qty,
      };
    });
});

// 默认加载 AAPL
onMounted(() => {
  searchInput.value = "BTC";
  handleSearch();
});
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50">
    <!-- 刷新余额 -->
    <div class="flex justify-end p-4">
      <Button
        class="bg-blue-600 text-white hover:bg-blue-700"
        @click="updateBalance"
      >
        Refresh Balance
      </Button>
    </div>

    <div class="mx-auto max-w-6xl space-y-10 p-6">
      <h1 class="mb-2 text-3xl font-bold text-gray-800">Crypto Market</h1>
      <p class="text-gray-500">
        Browse, search, and trade your favorite cryptos
      </p>

      <!-- 搜索栏 -->
      <div class="sticky top-16 z-10 flex gap-3 rounded-lg bg-white p-4 shadow">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Enter crypto name or ticker"
          class="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          @keyup.enter="handleSearch"
        />
        <Button
          @click="handleSearch"
          class="rounded-lg bg-blue-500 text-gray-700 hover:bg-blue-600"
        >
          Search
        </Button>
        <Button
          @click="clearSearch"
          class="rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                  <TableHead>Ticker</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead class="text-right">Quantity</TableHead>
                  <TableHead class="text-right">Price</TableHead>
                  <TableHead class="text-right">Total</TableHead>
                  <TableHead class="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="item in holdingsList"
                  :key="item.ticker"
                  class="hover:bg-gray-50"
                >
                  <TableCell>{{ item.ticker }}</TableCell>
                  <TableCell>{{ item.name }}</TableCell>
                  <TableCell class="text-right">{{ item.quantity }}</TableCell>
                  <TableCell class="text-right">${{ item.price }}</TableCell>
                  <TableCell class="text-right"
                    >${{ item.total.toFixed(2) }}
                  </TableCell>
                  <TableCell class="text-center">
                    <Button
                      class="bg-gradient-to-r from-red-500 to-red-600 text-white"
                      @click="
                        openTransaction(
                          {
                            code: item.ticker,
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

      <!-- 股票表格 -->
      <Card>
        <CardContent>
          <h2 class="mb-4 text-xl font-bold text-gray-800">
            Available Cryptos
          </h2>
          <Table class="w-full">
            <TableHeader>
              <TableRow class="bg-gray-100">
                <TableHead class="text-center">Ticker</TableHead>
                <TableHead class="text-center">Name</TableHead>
                <TableHead class="text-center">Price</TableHead>
                <TableHead class="text-center">Action</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-for="stock in displayedStocks" :key="stock.ticker">
                <TableRow
                  class="cursor-pointer hover:bg-gray-50"
                  @click="toggleExpand(stock.ticker)"
                >
                  <TableCell class="text-center">{{ stock.ticker }}</TableCell>
                  <TableCell class="text-center">{{ stock.name }}</TableCell>
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
                    <span
                      class="cursor-pointer text-lg"
                      @click.stop="toggleExpand(stock.ticker)"
                    >
                      {{ expandedStock === stock.ticker ? "▲" : "▼" }}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow v-if="expandedStock === stock.ticker">
                  <TableCell colspan="6">
                    <div
                      :id="`kline-${stock.ticker}`"
                      style="height: 300px"
                    ></div>
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
          <div
            v-if="!loading && displayedStocks.length === 0"
            class="mt-6 text-center text-gray-500"
          >
            No cryptos found
          </div>
          <div v-if="loading" class="mt-6 text-center text-gray-500">
            Loading...
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
            {{ selectedStock?.name }} ({{ selectedStock?.ticker }})
          </DialogTitle>
        </DialogHeader>

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

        <p class="font-semibold text-gray-600">
          Estimated Cost:
          <span class="text-blue-600">${{ transactionCost.toFixed(2) }}</span>
        </p>

        <DialogFooter class="mt-4">
          <Button
            @click="dialogOpen = false"
            class="bg-gray-300 text-gray-800 hover:bg-gray-400"
            >Cancel
          </Button>
          <Button
            @click="confirmTransaction"
            :class="
              transactionType === 'buy'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            "
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
