<script setup>
import { useAccountStore } from "@/stores/account.js";
import { Button } from "@/components/ui/button/index.js";
import { ref, computed } from "vue";
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

const accountStore = useAccountStore();

const updateBalance = () => {
  accountStore.setBalance(9999999.99);
};

// 用户持仓（股票代码 -> 股数）
const holdings = ref({});

// 模拟股票数据
const allStocks = ref([
  { code: "AAPL", name: "苹果公司", industry: "科技", price: 175.6 },
  { code: "TSLA", name: "特斯拉", industry: "汽车", price: 225.3 },
  { code: "AMZN", name: "亚马逊", industry: "电商", price: 135.8 },
  { code: "BABA", name: "阿里巴巴", industry: "电商", price: 95.2 },
  { code: "MSFT", name: "微软", industry: "科技", price: 315.7 },
  { code: "GOOG", name: "谷歌", industry: "科技", price: 2800.4 },
  { code: "NFLX", name: "奈飞", industry: "娱乐", price: 440.1 },
  { code: "NVDA", name: "英伟达", industry: "科技", price: 450.5 },
  { code: "META", name: "脸书", industry: "科技", price: 330.6 },
  { code: "ORCL", name: "甲骨文", industry: "科技", price: 120.8 },
  { code: "INTC", name: "英特尔", industry: "科技", price: 35.9 },
  { code: "AMD", name: "超威", industry: "科技", price: 105.4 },
  { code: "UBER", name: "优步", industry: "出行", price: 45.7 },
  { code: "LYFT", name: "来福车", industry: "出行", price: 12.3 },
  { code: "DIS", name: "迪士尼", industry: "娱乐", price: 98.5 },
  { code: "SONY", name: "索尼", industry: "娱乐", price: 88.4 },
  { code: "PFE", name: "辉瑞", industry: "医药", price: 38.2 },
  { code: "JNJ", name: "强生", industry: "医药", price: 165.4 },
  { code: "MRNA", name: "莫德纳", industry: "医药", price: 120.3 },
  { code: "BA", name: "波音", industry: "航空", price: 210.7 },
  { code: "AIRB", name: "空客", industry: "航空", price: 150.9 },
  { code: "XOM", name: "埃克森美孚", industry: "能源", price: 105.2 },
  { code: "CVX", name: "雪佛龙", industry: "能源", price: 160.1 },
  { code: "BP", name: "英国石油", industry: "能源", price: 35.8 },
  { code: "T", name: "美国电话电报", industry: "通信", price: 14.7 },
  { code: "VZ", name: "威瑞森", industry: "通信", price: 34.5 },
  { code: "CHL", name: "中国移动", industry: "通信", price: 51.6 },
  { code: "SHOP", name: "Shopify", industry: "电商", price: 70.2 },
  { code: "JD", name: "京东", industry: "电商", price: 32.5 },
  { code: "PDD", name: "拼多多", industry: "电商", price: 145.6 },
  { code: "NIO", name: "蔚来", industry: "汽车", price: 9.4 },
  { code: "LI", name: "理想汽车", industry: "汽车", price: 27.3 },
  { code: "XPEV", name: "小鹏汽车", industry: "汽车", price: 16.8 },
  { code: "RIVN", name: "Rivian", industry: "汽车", price: 18.6 },
  { code: "F", name: "福特", industry: "汽车", price: 13.2 },
]);

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
    alert("请输入有效数量或金额！");
    return;
  }

  const code = selectedStock.value.code;

  if (transactionType.value === "buy") {
    if (accountStore.balance < totalCost) {
      alert("余额不足，无法买入！");
      return;
    }
    accountStore.balance -= totalCost;
    holdings.value[code] = (holdings.value[code] || 0) + qty;
  } else {
    if ((holdings.value[code] || 0) < qty) {
      alert("持仓不足，无法卖出！");
      return;
    }
    accountStore.balance += totalCost;
    holdings.value[code] -= qty;
  }

  dialogOpen.value = false;
};
</script>

<template>
  <div class="w-full">
    This is Fund page
    <Button @click="updateBalance">Update</Button>
    <div class="mx-auto max-w-5xl p-6">
      <h1 class="mb-6 text-2xl font-bold">Fund Market</h1>

      <!-- 搜索栏 -->
      <div class="sticky top-16 z-10 mb-6 flex gap-2 bg-white p-4 shadow">
        <input
          v-model="searchInput"
          type="text"
          placeholder="请输入股票名称或代码"
          class="flex-1 rounded border px-3 py-2"
          @keyup.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          class="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
        >
          搜索
        </button>
        <button
          @click="clearSearch"
          class="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
        >
          清空
        </button>
      </div>

      <!-- 股票信息表格，全宽 -->
      <Card class="w-full">
        <CardContent>
          <Table class="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>股票代码</TableHead>
                <TableHead>股票名称</TableHead>
                <TableHead>行业</TableHead>
                <TableHead class="text-right">价格 (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="stock in displayedStocks" :key="stock.code">
                <TableCell>{{ stock.code }}</TableCell>
                <TableCell>{{ stock.name }}</TableCell>
                <TableCell>{{ stock.industry }}</TableCell>
                <TableCell class="text-right">${{ stock.price }}</TableCell>
                <!--买卖操作-->
                <TableCell class="text-center">
                  <Button
                    class="mr-2 bg-green-600 text-black hover:bg-green-700"
                    @click="openTransaction(stock, 'buy')"
                  >
                    买入
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- 空结果提示 -->
      <div v-if="displayedStocks.length === 0" class="mt-6 text-gray-500">
        未找到相关股票信息
      </div>
    </div>

    <!-- 买卖股票弹窗 -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {{ transactionType === "buy" ? "买入" : "卖出" }}
            {{ selectedStock?.name }} ({{ selectedStock?.code }})
          </DialogTitle>
        </DialogHeader>

        <!-- 输入模式切换 -->
        <div class="mb-4 flex gap-4">
          <Button
            variant="outline"
            :class="inputMode === 'shares' ? 'bg-gray-200' : ''"
            @click="inputMode = 'shares'"
          >
            按股数
          </Button>
          <Button
            variant="outline"
            :class="inputMode === 'amount' ? 'bg-gray-200' : ''"
            @click="inputMode = 'amount'"
          >
            按金额
          </Button>
        </div>

        <!-- 输入框（股数模式） -->
        <template v-if="inputMode === 'shares'">
          <Input
            type="number"
            min="1"
            :value="shares"
            @input="(e) => (shares = Number(e.target.value))"
            placeholder="请输入股数"
          />
        </template>

        <!-- 输入框（金额模式） -->
        <template v-else>
          <Input
            type="number"
            min="1"
            :value="amount"
            @input="(e) => (amount = Number(e.target.value))"
            placeholder="请输入金额"
          />
        </template>

        <!-- 动态交易金额 -->
        <p class="text-gray-500">交易金额：${{ transactionCost.toFixed(2) }}</p>

        <DialogFooter>
          <Button @click="dialogOpen = false" class="bg-gray-300 text-black">
            取消
          </Button>
          <Button
            @click="confirmTransaction"
            :class="
              transactionType === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            "
            class="text-black"
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
