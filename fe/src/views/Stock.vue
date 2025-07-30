<script setup>
import { ref, onMounted, computed } from "vue";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Accordion } from "@/components/ui/accordion/index.js";
import { Button } from "@/components/ui/button";
import KLine from "@/components/stock/KLine.vue";
import BuyDrawer from "@/components/stock/BuyDrawer.vue";
import { Loader2, ShoppingCart, X, Search } from "lucide-vue-next";
import { useAccountStore } from "@/stores/account.js";
import { Input } from "@/components/ui/input";
import api from "@/lib/request.js";

// 账户信息
const accountStore = useAccountStore();

const allStocks = ref([]);
const searchInput = ref("");
const searching = ref(false);

// 格式化后端数据
const formatStockList = (arr) =>
  arr.map((stock) => {
    const detail = stock.detail || [];
    const len = detail.length;
    const price = len > 0 ? Number(detail[len - 1].close ?? "--") : "--";
    const prevPrice = len > 1 ? Number(detail[len - 2].close ?? price) : price;
    const priceChange =
      price !== "--" && prevPrice !== "--" ? price - prevPrice : 0;
    return {
      ticker: stock.ticker,
      name: stock.name,
      price,
      priceChange,
      kline: detail,
    };
  });

// debounce + 后端请求
let debounceTimer = null;
const handleSearch = () => {
  searching.value = true;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      let params = {};
      if (searchInput.value.trim()) {
        params.search = searchInput.value.trim();
      }
      const res = await api.get("/market/stock", params);
      allStocks.value = formatStockList(res);
    } catch {
      allStocks.value = [];
    }
    searching.value = false;
  }, 300);
};

// 初始化加载（获取全量）
onMounted(() => {
  handleSearch();
});

// stocks 直接渲染后端结果，不再做本地 filter
const stocks = computed(() => allStocks.value);

// Accordion展开项
const expandedItems = ref([]);

// BuyDrawer相关
const buyDrawerOpen = ref(false);
const buyLoading = ref(false);
const buyError = ref("");
const selectedStock = ref(null);

const openBuyDrawer = (stock) => {
  selectedStock.value = stock;
  buyDrawerOpen.value = true;
  buyError.value = "";
};

// 处理BuyDrawer确认买入
const handleBuyConfirm = async ({ quantity, price, stock }) => {
  if (!quantity || !price || quantity <= 0 || price <= 0) {
    buyError.value = "Please enter a valid quantity and price.";
    return;
  }
  buyLoading.value = true;
  buyError.value = "";
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    buyDrawerOpen.value = false;
    await accountStore.fetchAccountInfo(1);
    // // 真实api可用如下方式
    // const payload = { type: "buy", ticker: stock.ticker, quantity, price };
    // const res = await api.post("/portfolio/transaction", payload);
    // if (res.code === 200) { buyDrawerOpen.value = false; await accountStore.fetchAccountInfo(); }
    // else { buyError.value = res.msg || "Buy order failed."; }
  } catch (e) {
    buyError.value = "Network error, please try again.";
  } finally {
    buyLoading.value = false;
  }
};
const handleBuyCancel = () => {
  buyError.value = "";
};

const formatPriceChange = (delta) => {
  const abs = Math.abs(delta).toFixed(2);
  if (Number(delta) === 0) return "0.00";
  return (delta > 0 ? "+" : "-") + abs;
};
</script>

<template>
  <div class="min-h-screen w-full">
    <!-- 顶部搜索栏 -->
    <div class="sticky top-24 z-888 flex items-center justify-between gap-2">
      <p
        class="flex h-10 items-center justify-center rounded-4xl border bg-white/70 px-6 shadow-lg backdrop-blur-md"
      >
        Market <span class="mx-3">/</span> Stock
      </p>
      <div class="flex items-center gap-3">
        <Input
          v-model="searchInput"
          placeholder="e.g. aapl, tsla"
          class="h-10 flex-1 rounded-4xl border bg-white/70 px-4 shadow-lg backdrop-blur-md"
          @input="handleSearch"
        />
        <Button
          class="size-10 rounded-4xl border bg-white/70 px-4 shadow-lg backdrop-blur-md"
          :disabled="searching"
          variant="outline"
          size="icon"
          @click="handleSearch"
        >
          <Search class="size-5" />
        </Button>
        <Button
          class="size-10 rounded-4xl border bg-white/70 px-4 shadow-lg backdrop-blur-md"
          variant="outline"
          size="icon"
          @click="
            searchInput = '';
            handleSearch();
          "
        >
          <X class="size-5" />
        </Button>
      </div>
    </div>
    <div class="mt-4">
      <!-- 股票Accordion列表 -->
      <Accordion v-model="expandedItems" type="multiple">
        <template v-for="stock in stocks" :key="stock.ticker">
          <AccordionItem :value="stock.ticker">
            <AccordionTrigger
              class="flex w-full items-center px-4 py-3 font-medium"
            >
              <div class="flex flex-1 items-center gap-3">
                <span class="font-bold">{{ stock.name }}</span>
                <span class="text-xs text-gray-500">({{ stock.ticker }})</span>
              </div>
              <div class="mr-2 min-w-[80px] text-right">
                <span>
                  {{ stock.price !== "--" ? "$" + stock.price : "--" }}
                </span>
              </div>
              <div class="mr-8 min-w-[64px] text-right">
                <span
                  :class="{
                    'text-green-600': stock.priceChange > 0,
                    'text-red-500': stock.priceChange < 0,
                    'text-gray-500': stock.priceChange === 0,
                  }"
                >
                  {{ formatPriceChange(stock.priceChange) }}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                class="ml-2 rounded-full"
                @click.stop="openBuyDrawer(stock)"
              >
                <ShoppingCart class="h-5 w-5" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <div class="p-4">
                <KLine
                  :klineData="stock.kline"
                  :chartId="`kline-${stock.ticker}`"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </template>
      </Accordion>
      <div v-if="stocks.length === 0" class="mt-8 text-center text-gray-500">
        No stocks found.
      </div>
    </div>

    <!-- 买入Drawer -->
    <BuyDrawer
      v-if="selectedStock"
      v-model:open="buyDrawerOpen"
      :stock="selectedStock"
      :default-quantity="1"
      :default-price="Number(selectedStock.price)"
      :loading="buyLoading"
      :error="buyError"
      @confirm="handleBuyConfirm"
      @cancel="handleBuyCancel"
    />
  </div>
</template>
