<script setup>
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Layers,
  HandCoins,
  Plus,
  Minus,
  ChartCandlestick,
} from "lucide-vue-next";

// 1. 响应式数据定义
// 持仓数据（后期可从API加载）
const accountOverview = ref([
  {
    name: "Portfolio A",
    ticker: "AAPL",
    amount: 150, // 持仓份额
    profit: 1999, // 收益金额
    current_price: 214.05, // 当前价格
    cost_price: 190.0, // 成本价（用于计算收益）
  },
  {
    name: "Portfolio B",
    ticker: "TSLA",
    amount: 80,
    profit: -230,
    current_price: 298.12,
    cost_price: 320.0,
  },
  {
    name: "Portfolio C",
    ticker: "MSFT",
    amount: 120,
    profit: 3100,
    current_price: 345.67,
    cost_price: 320.5,
  },
  {
    name: "Portfolio D",
    ticker: "BTC",
    amount: 0.75,
    profit: 4200,
    current_price: 29850.25,
    cost_price: 28500.0,
  },
  {
    name: "Portfolio E",
    ticker: "ETH",
    amount: 5,
    profit: -950,
    current_price: 1985.6,
    cost_price: 2150.0,
  },
  {
    name: "Portfolio F",
    ticker: "FUND001",
    amount: 1000,
    profit: 320,
    current_price: 2.45,
    cost_price: 2.1,
  },
  {
    name: "Portfolio G",
    ticker: "NVDA",
    amount: 60,
    profit: 4000,
    current_price: 460.2,
    cost_price: 410.0,
  },
  {
    name: "Portfolio H",
    ticker: "SOL",
    amount: 120,
    profit: 650,
    current_price: 24.8,
    cost_price: 22.5,
  },
  {
    name: "Portfolio I",
    ticker: "PDD",
    amount: 200,
    profit: 2800,
    current_price: 156.3,
    cost_price: 142.0,
  },
  {
    name: "Portfolio J",
    ticker: "FUND005",
    amount: 500,
    profit: 120,
    current_price: 3.15,
    cost_price: 3.0,
  },
]);

// 弹窗控制变量
const showDialog = ref(false); // 卖出弹窗显示状态
const showBuyDialog = ref(false); // 买入弹窗显示状态
const selectedProduct = ref(null); // 当前选中的操作产品

// 买入相关变量
const buyMode = ref("shares"); // 买入模式：按份额(shares)或金额(amount)
const buyValue = ref(""); // 买入输入值

// 卖出相关变量
const sellMode = ref("shares"); // 卖出模式：按份额(shares)或金额(amount)
const sellValue = ref(""); // 卖出输入值

// 2. 计算属性
// 计算总资产：持仓份额 × 当前价格之和
const totalValue = computed(() => {
  const total = accountOverview.value.reduce(
    (sum, item) => sum + item.amount * item.current_price,
    0,
  );
  return total.toLocaleString(undefined, { maximumFractionDigits: 2 });
});

// 3. 数据操作服务（封装业务逻辑，便于后期对接API）
const portfolioService = {
  /**
   * 加载持仓数据
   * 后期对接API时，替换为真实接口调用
   */
  async loadHoldings() {
    // 模拟API请求延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...accountOverview.value]);
      }, 500);
    });
  },

  /**
   * 买入操作
   * @param {Object} product - 产品信息
   * @param {number} quantity - 买入份额
   */
  async buy(product, quantity) {
    return new Promise((resolve) => {
      // 找到对应产品并更新数据
      const item = accountOverview.value.find(
        (item) => item.ticker === product.ticker,
      );
      if (item) {
        // 增加持仓份额
        item.amount = Number((item.amount + quantity).toFixed(6));
        // 重新计算收益：(当前价 - 成本价) × 总份额
        item.profit = Number(
          ((item.current_price - item.cost_price) * item.amount).toFixed(2),
        );
      }
      resolve(true);
    });
  },

  /**
   * 卖出操作
   * @param {Object} product - 产品信息
   * @param {number} quantity - 卖出份额
   */
  async sell(product, quantity) {
    return new Promise((resolve, reject) => {
      const item = accountOverview.value.find(
        (item) => item.ticker === product.ticker,
      );

      // 验证：产品是否存在
      if (!item) {
        return reject(new Error("Product not found"));
      }

      // 验证：卖出份额是否超过持仓
      if (item.amount < quantity) {
        return reject(new Error("Cannot sell more than you hold"));
      }

      // 更新持仓数据
      item.amount = Number((item.amount - quantity).toFixed(6));
      // 重新计算收益
      item.profit = Number(
        ((item.current_price - item.cost_price) * item.amount).toFixed(2),
      );

      resolve(true);
    });
  },
};

// 4. 生命周期钩子
// 组件挂载时加载数据（模拟API请求流程）
onMounted(async () => {
  try {
    const data = await portfolioService.loadHoldings();
    accountOverview.value = data;
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    alert("Failed to load portfolio data. Please try again later.");
  }
});

// 5. 事件处理函数
/**
 * 打开卖出弹窗
 * @param {Object} item - 选中的产品
 */
function openSellDialog(item) {
  selectedProduct.value = item;
  sellValue.value = "";
  sellMode.value = "shares";
  showDialog.value = true;
}

/**
 * 打开买入弹窗
 * @param {Object} item - 选中的产品
 */
function openBuyDialog(item) {
  selectedProduct.value = item;
  buyValue.value = "";
  buyMode.value = "shares";
  showBuyDialog.value = true;
}

/**
 * 确认卖出
 */
async function confirmSell() {
  // 输入验证
  if (
    !selectedProduct.value ||
    !sellValue.value ||
    Number(sellValue.value) <= 0
  ) {
    alert("Please enter a valid quantity");
    return;
  }

  // 根据模式计算卖出份额
  const quantity =
    sellMode.value === "shares"
      ? Number(sellValue.value) // 按份额卖出
      : Number(
          (
            Number(sellValue.value) / selectedProduct.value.current_price
          ).toFixed(6),
        ); // 按金额换算份额

  if (quantity <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }

  try {
    await portfolioService.sell(selectedProduct.value, quantity);
    showDialog.value = false;
  } catch (error) {
    alert(error.message);
  }
}

/**
 * 确认买入
 */
async function confirmBuy() {
  // 输入验证
  if (
    !selectedProduct.value ||
    !buyValue.value ||
    Number(buyValue.value) <= 0
  ) {
    alert("Please enter a valid quantity");
    return;
  }

  // 根据模式计算买入份额
  const quantity =
    buyMode.value === "shares"
      ? Number(buyValue.value) // 按份额买入
      : Number(
          (
            Number(buyValue.value) / selectedProduct.value.current_price
          ).toFixed(6),
        ); // 按金额换算份额

  if (quantity <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }

  try {
    await portfolioService.buy(selectedProduct.value, quantity);
    showBuyDialog.value = false;
  } catch (error) {
    alert(error.message);
  }
}
</script>

<template>
  <div
    class="sticky top-24 z-888 mb-4 w-full rounded-2xl border bg-white/70 p-4 shadow-lg backdrop-blur-md"
  >
    <div class="flex items-center gap-1">
      <ChartCandlestick class="size-4" />
      <span class="">Assets</span>
    </div>

    <div class="mt-2 text-xl">${{ totalValue }}</div>
  </div>

  <div class="">
    <div class="mb-6">
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2"
      >
        <div
          v-for="(item, index) in accountOverview"
          :key="index"
          class="relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <!-- 产品名 -->
          <div class="mb-2 text-sm text-gray-800">
            <div>{{ item.name }}</div>
            <div class="text-xs text-gray-500">({{ item.ticker }})</div>
          </div>

          <!-- 当前价格 -->
          <div class="mb-3 text-sm text-gray-700">
            ${{ item.current_price.toLocaleString() }}
          </div>

          <!-- 收益 -->

          <!-- 持仓份额 -->
          <div
            class="mb-2 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm"
          >
            <div class="flex items-center gap-1">
              <Layers class="size-4" />
              {{ item.amount.toLocaleString() }}
            </div>
            <div class="flex items-center gap-1">
              <HandCoins class="size-4" />
              <span
                :class="item.profit >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ item.profit >= 0 ? "+" : "" }}${{
                  item.profit.toLocaleString()
                }}
              </span>
            </div>
          </div>

          <!-- 操作按钮组 -->
          <div class="flex justify-end space-x-2">
            <Button variant="outline" size="icon" @click="openBuyDialog(item)">
              <Plus />
            </Button>
            <Button variant="outline" size="icon" @click="openSellDialog(item)">
              <Minus />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 卖出弹窗 -->
  <Dialog v-model:open="showDialog">
    <DialogContent class="max-w-sm">
      <DialogHeader>
        <DialogTitle>Sell {{ selectedProduct?.name }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <RadioGroup v-model="sellMode" class="flex space-x-4">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="shares" id="shares" />
            <label for="shares">By shares</label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="amount" id="amount" />
            <label for="amount">By amount</label>
          </div>
        </RadioGroup>

        <Input
          v-model="sellValue"
          placeholder="Please enter the quantity"
          type="number"
          min="0"
          step="any"
          class="w-full"
        />
      </div>

      <DialogFooter>
        <Button variant="secondary" @click="showDialog = false">Cancel</Button>
        <Button class="text-black" variant="destructive" @click="confirmSell"
          >Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- 买入弹窗 -->
  <Dialog v-model:open="showBuyDialog">
    <DialogContent class="max-w-sm">
      <DialogHeader>
        <DialogTitle>Buy {{ selectedProduct?.name }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <RadioGroup v-model="buyMode" class="flex space-x-4">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="shares" id="buy-shares" />
            <label for="buy-shares">By share</label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="amount" id="buy-amount" />
            <label for="buy-amount">By amount</label>
          </div>
        </RadioGroup>

        <Input
          v-model="buyValue"
          placeholder="Please enter the quantity"
          type="number"
          min="0"
          step="any"
          class="w-full"
        />
      </div>

      <DialogFooter>
        <Button variant="secondary" @click="showBuyDialog = false"
          >Cancel
        </Button>
        <Button
          class="bg-green-600 text-black hover:bg-green-700"
          @click="confirmBuy"
        >
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
