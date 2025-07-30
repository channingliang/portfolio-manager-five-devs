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
import { mockStocks } from "@/lib/api.js";
import { Loader2, ShoppingCart, X, Search } from "lucide-vue-next";
import { useAccountStore } from "@/stores/account.js";
import { Input } from "@/components/ui/input";

// 账户信息
const accountStore = useAccountStore();

const allStocks = ref([]);
const searchInput = ref("");
const searching = ref(false);

// 搜索处理
let debounceTimer = null;
const handleSearch = () => {
  searching.value = true;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    allStocks.value = mockStocks.map((s) => ({
      ...s,
      price: s.kline?.[s.kline.length - 1]?.close || "--",
    }));
    searching.value = false;
  }, 300);
};

// 过滤后stocks
const stocks = computed(() => {
  if (!searchInput.value) return allStocks.value;
  return allStocks.value.filter((s) =>
    (s.ticker + s.name)
      .toLowerCase()
      .includes(searchInput.value.trim().toLowerCase()),
  );
});

// Accordion展开项
const expandedItems = ref([]);

// BuyDrawer相关
const buyDrawerOpen = ref(false);
const buyLoading = ref(false);
const buyError = ref("");
const selectedStock = ref(null);

onMounted(() => {
  allStocks.value = mockStocks.map((s) => ({
    ...s,
    price: s.kline?.[s.kline.length - 1]?.close || "--",
  }));
});

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
    await accountStore.fetchAccountInfo();
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
</script>

<template>
  <div class="min-h-screen w-full">
    <!-- 顶部搜索栏 -->
    <div class="sticky top-24 z-888 flex items-center justify-between gap-2">
      <p
        class="flex h-10 items-center justify-center rounded-4xl border bg-white/70 px-4 shadow-lg backdrop-blur-md"
      >
        Market / Stock
      </p>
      <!-- 搜索栏 -->
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
              <div class="mr-8 min-w-[80px] text-right">
                {{ stock.price !== "--" ? "$" + stock.price : "--" }}
              </div>
              <Button
                variant="outline"
                size="icon"
                class="ml-2"
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
