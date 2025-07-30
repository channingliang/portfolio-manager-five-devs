<script setup>
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Layers,
  HandCoins,
  Plus,
  Minus,
  ChartCandlestick,
} from "lucide-vue-next";
import api from "@/lib/request.js";
import { useAccountStore } from "@/stores/account.js";
import BuyDrawer from "@/components/stock/BuyDrawer.vue";
import SellDrawer from "@/components/stock/SellDrawer.vue";
import eventBus from "@/lib/eventBus.js";

// 当前登录账号ID
const accountId = 1;

// 资产数据
const holdingAssets = ref([]);

// 当前操作资产
const selectedProduct = ref(null);

// Drawer 控制
const buyDrawerOpen = ref(false);
const sellDrawerOpen = ref(false);
const buyLoading = ref(false);
const sellLoading = ref(false);
const buyError = ref("");
const sellError = ref("");

// 总资产
const totalValue = computed(() =>
  holdingAssets.value
    .reduce(
      (sum, item) =>
        sum + Number(item.quantity) * Number(item.current?.price_per_unit ?? 0),
      0,
    )
    .toLocaleString(undefined, { maximumFractionDigits: 2 }),
);

// 盈亏样式与文本
const getProfitClass = (item) => {
  if (!item.current) return "";
  return item.current.profit_loss >= 0 ? "text-green-600" : "text-red-600";
};
const getProfitText = (item) => {
  if (!item.current) return "";
  const profit = Number(item.current.profit_loss);
  return `${profit >= 0 ? "+" : ""}$${profit.toLocaleString()}`;
};

// 加载资产
const loadHoldings = () => {
  api
    .get("/portfolio/holding", { account_id: accountId })
    .then((res) => {
      holdingAssets.value = Array.isArray(res) ? res : [];
    })
    .catch((e) => {
      holdingAssets.value = [];
      alert(e?.msg || "Failed to load holdings");
    });
};

onMounted(loadHoldings);

// 打开drawer
function openBuyDrawer(item) {
  selectedProduct.value = item;
  buyDrawerOpen.value = true;
  buyError.value = "";
}

function openSellDrawer(item) {
  selectedProduct.value = item;
  sellDrawerOpen.value = true;
  sellError.value = "";
}

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
      account_id: accountId,
      ticker: stock.ticker,
      ticker_type: stock.ticker_type,
      transaction_type: 1,
      quantity,
      price_per_unit: price,
    })
    .then(() => {
      buyDrawerOpen.value = false;
      loadHoldings();
      useAccountStore().fetchAccountInfo?.();
      eventBus.emit("cash-updated");
    })
    .catch((e) => {
      buyError.value = e?.msg || "Buy failed";
    })
    .finally(() => {
      buyLoading.value = false;
    });
};

// 卖出确认
const handleSellConfirm = async ({ quantity, price, stock }) => {
  if (!quantity || !price || quantity <= 0 || price <= 0) {
    sellError.value = "Please enter a valid quantity and price.";
    return;
  }
  if (quantity > Number(stock.quantity)) {
    sellError.value = "Cannot sell more than you hold";
    return;
  }
  sellLoading.value = true;
  sellError.value = "";
  api
    .post("/portfolio/transaction", {
      account_id: accountId,
      ticker: stock.ticker,
      ticker_type: stock.ticker_type,
      transaction_type: 2,
      quantity,
      price_per_unit: price,
    })
    .then(() => {
      sellDrawerOpen.value = false;
      loadHoldings();
      useAccountStore().fetchAccountInfo?.();
      eventBus.emit("cash-updated");
    })
    .catch((e) => {
      sellError.value = e?.msg || "Sell failed";
    })
    .finally(() => {
      sellLoading.value = false;
    });
};
</script>

<template>
  <div
    class="sticky top-24 z-888 mb-4 w-full rounded-2xl border bg-white/70 p-4 shadow-lg"
  >
    <div class="flex items-center gap-1">
      <ChartCandlestick class="size-4" />
      <span>Assets</span>
    </div>
    <div class="mt-2 text-xl">${{ totalValue }}</div>
  </div>

  <div class="mb-6">
    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2"
    >
      <div
        v-for="(item, index) in holdingAssets"
        :key="item.portfolio_holding_id || index"
        class="relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
      >
        <!-- 产品名和代码 -->
        <div class="mb-2 text-sm">
          <div class="text-end text-xs text-gray-500">
            {{ item.ticker_type === 1 ? "Stock" : "Crypto/Fund" }}
          </div>
          <div class="font-bold">
            <p>{{ item.name }}</p>
            <p class="mt-1 text-xs text-gray-500">{{ item.ticker }}</p>
          </div>
        </div>
        <!-- 当前价格 -->
        <div class="mb-3 text-sm text-gray-700">
          ${{ Number(item.current?.price_per_unit || 0).toLocaleString() }}
        </div>
        <!-- 持仓份额&盈亏 -->
        <div
          class="mb-2 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm"
        >
          <div class="flex items-center gap-1">
            <Layers class="size-4" />
            {{ Number(item.quantity).toLocaleString() }}
          </div>
          <div class="flex items-center gap-1">
            <HandCoins class="size-4" />
            <span :class="getProfitClass(item)">
              {{ getProfitText(item) }}
            </span>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-2">
          <Button variant="outline" size="icon" @click="openBuyDrawer(item)">
            <Plus />
          </Button>
          <Button variant="outline" size="icon" @click="openSellDrawer(item)">
            <Minus />
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- 买入Drawer -->
  <BuyDrawer
    v-if="selectedProduct"
    v-model:open="buyDrawerOpen"
    :stock="selectedProduct"
    :default-quantity="1"
    :default-price="Number(selectedProduct.current?.price_per_unit || 0)"
    :loading="buyLoading"
    :error="buyError"
    @confirm="handleBuyConfirm"
    @cancel="buyError = ''"
  />

  <!-- 卖出Drawer，关键是这里！holding 传持有份额 -->
  <SellDrawer
    v-if="selectedProduct"
    v-model:open="sellDrawerOpen"
    :stock="selectedProduct"
    :default-quantity="1"
    :default-price="Number(selectedProduct.current?.price_per_unit || 0)"
    :holding="Number(selectedProduct.quantity)"
    :loading="sellLoading"
    :error="sellError"
    @confirm="handleSellConfirm"
    @cancel="sellError = ''"
  />
</template>
