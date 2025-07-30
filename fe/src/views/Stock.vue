<script setup>
// 页面卸载清理定时器（可选）
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Accordion } from "@/components/ui/accordion/index.js";
import { Button } from "@/components/ui/button";
import KLine from "@/components/stock/KLine.vue";
import BuyDrawer from "@/components/stock/BuyDrawer.vue";
import { Loader2, RotateCw, Search, ShoppingCart, X } from "lucide-vue-next";
import { useAccountStore } from "@/stores/account.js";
import { Input } from "@/components/ui/input";
import api from "@/lib/request.js";

// 账户信息
const accountStore = useAccountStore();

const allStocksRaw = ref([]); // 原始数据
const allStocks = ref([]); // 用于显示（可抖动价格）
const searchInput = ref("");
const searching = ref(false);
const loading = ref(false); // 页面全局loading
let priceUpdateTimer = null; // 定时器

// 处理后端数据
const formatStockList = (arr, oldArr = []) =>
  arr.map((stock, idx) => {
    const detail = stock.detail || [];
    const len = detail.length;
    // 实时价: 初始用后端，后续本地可抖动
    // 如果已经有抖动过的价格，优先用旧值
    let price =
      typeof stock.price_per_unit === "number" ? stock.price_per_unit : "--";
    if (oldArr && oldArr[idx] && typeof oldArr[idx].price === "number") {
      price = oldArr[idx].price;
    }
    // 最新一天收盘价
    const lastClose = len > 0 ? Number(detail[len - 1].close ?? price) : price;
    // 差价
    const priceChange =
      price !== "--" && lastClose !== "--" ? price - lastClose : 0;
    return {
      ticker: stock.ticker,
      name: stock.name,
      price, // 当前实时价
      priceChange, // 当前涨跌
      kline: detail,
      price_per_unit:
        typeof stock.price_per_unit === "number"
          ? stock.price_per_unit
          : undefined,
      lastClose,
    };
  });

// debounce + 后端请求
let debounceTimer = null;
const handleSearch = async (isManualRefresh = false) => {
  searching.value = true;
  if (!isManualRefresh) clearTimeout(debounceTimer);

  const doSearch = async () => {
    try {
      loading.value = true;
      let params = {};
      if (searchInput.value.trim()) {
        params.search = searchInput.value.trim();
      }
      const res = await api.get("/market/stock", params);
      allStocksRaw.value = Array.isArray(res) ? res : [];
      allStocks.value = formatStockList(allStocksRaw.value);
    } catch {
      allStocksRaw.value = [];
      allStocks.value = [];
    }
    searching.value = false;
    loading.value = false;
  };

  if (isManualRefresh) {
    await doSearch();
  } else {
    debounceTimer = setTimeout(doSearch, 300);
  }
};

// 刷新按钮
const handleRefresh = () => {
  handleSearch(true);
};

// 初始化加载（获取全量）
onMounted(() => {
  handleSearch();
  setupPriceUpdate();
});

// stocks 直接渲染处理后的
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

// 买入确认
const handleBuyConfirm = async ({ quantity, price, stock }) => {
  if (!quantity || !price || quantity <= 0 || price <= 0) {
    buyError.value = "Please enter a valid quantity and price.";
    return;
  }
  buyLoading.value = true;
  buyError.value = "";
  
  api
    .post("/portfolio/transaction", {
      account_id: accountStore.id,
      ticker: stock.ticker,
      ticker_type: 1,
      transaction_type: 1,
      quantity: quantity,
      price_per_unit: price,
    })
    .then(() => {
      buyDrawerOpen.value = false;
      useAccountStore().fetchAccountInfo?.();
    })
    .catch((e) => {
      buyError.value = e?.msg || "Buy failed";
    })
    .finally(() => {
      buyLoading.value = false;
    });
};

const handleBuyCancel = () => {
  buyError.value = "";
};

const formatPriceChange = (delta) => {
  const abs = Math.abs(delta).toFixed(2);
  if (Number(delta) === 0) return "0.00";
  return (delta > 0 ? "+" : "-") + abs;
};

// --- 模拟3秒price_per_unit抖动 ---
function setupPriceUpdate() {
  if (priceUpdateTimer) clearInterval(priceUpdateTimer);
  priceUpdateTimer = setInterval(() => {
    // 仅在有数据且页面显示时刷新
    if (allStocksRaw.value.length > 0 && allStocks.value.length > 0) {
      // 只改变price，不变动lastClose
      allStocks.value = allStocks.value.map((s, idx) => {
        // 原始后端价
        const base =
          typeof allStocksRaw.value[idx]?.price_per_unit === "number"
            ? allStocksRaw.value[idx].price_per_unit
            : s.price;
        // 模拟小幅波动[-0.8, 0.8]
        const delta = Math.floor((Math.random() - 0.5) * 160) / 100;
        const nextPrice = Math.max(0.01, Number((base + delta).toFixed(2)));
        // 差价用当前抖动价和lastClose
        const lastClose = s.lastClose ?? nextPrice;
        const priceChange = nextPrice - lastClose;
        return {
          ...s,
          price: nextPrice,
          priceChange,
        };
      });
    }
  }, 3000);
}

onMounted(setupPriceUpdate);

onUnmounted(() => {
  if (priceUpdateTimer) clearInterval(priceUpdateTimer);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<template>
  <div class="min-h-screen w-full">
    <!-- 顶部搜索栏 -->
    <div class="sticky top-24 z-888 flex items-center justify-between gap-2">
      <div class="flex items-center justify-center gap-3">
        <div
          class="flex h-10 items-center rounded-4xl border bg-white/70 px-6 shadow-lg backdrop-blur-md"
        >
          Market <span class="mx-3">/</span> Stock
        </div>
        <Button
          class="size-10 rounded-4xl border bg-white/70 px-4 shadow-lg backdrop-blur-md"
          :disabled="searching || loading"
          variant="outline"
          size="icon"
          @click="handleRefresh"
        >
          <RotateCw class="size-5" :class="{ 'animate-spin': loading }" />
        </Button>
      </div>

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
      <!-- 加载中动画 -->
      <div v-if="loading" class="flex h-60 items-center justify-center">
        <Loader2 class="h-10 w-10 animate-spin text-blue-500" />
      </div>
      <!-- 股票Accordion列表 -->
      <Accordion v-else v-model="expandedItems" type="multiple">
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
                class="mr-2 rounded-full"
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
      <div
        v-if="!loading && stocks.length === 0"
        class="mt-8 text-center text-gray-500"
      >
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
