<template>
  <div class="medium">
    <!-- 标题 -->
    <h2 class="mb-4 text-xl font-semibold text-gray-900">Account Overview</h2>

    <!-- 投资资产行 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- 投资资产图标 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-600"
        >
          <rect x="3" y="10" width="4" height="11" rx="1"></rect>
          <rect x="10" y="6" width="4" height="15" rx="1"></rect>
          <rect x="17" y="2" width="4" height="19" rx="1"></rect>
        </svg>
        <span class="text-gray-600">Portfolio Assets</span>
      </div>

      <!-- 总资产 -->
      <div class="font-bold text-gray-900">
        ￥{{ totalValue.toLocaleString() }}
      </div>
    </div>

    <!-- 持仓产品 -->
    <div class="mb-6">
      <div class="grid grid-cols-2 gap-4">
        <!-- 产品卡片 -->
        <div
          v-for="(item, index) in accountOverview"
          :key="index"
          class="relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <!-- 产品名 -->
          <div class="text-sm text-gray-800">
            <div>{{ item.name }}</div>
            <div class="text-xs text-gray-500">({{ item.ticker }})</div>
          </div>

          <!-- 收益 -->
          <div
            class="flex items-center text-sm"
            :class="item.profit >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            <ChartNoAxesCombined class="size-4" />
            ￥{{ item.profit.toLocaleString() }}
          </div>

          <!-- 持仓份额 -->
          <div class="flex items-center text-sm text-gray-600">
            <Inbox class="size-4" />
            {{ item.amount.toLocaleString() }}
          </div>

          <!-- 当前价格 + 卖出按钮 -->
          <div class="flex flex-col space-x-2">
            ￥{{ item.current_price.toLocaleString() }}
          </div>
          <Button variant="outline" size="icon" @click="openSellDialog(item)">
            <Plus />
          </Button>
          <Button
            Button
            variant="outline"
            size="icon"
            @click="openBuyDialog(item)"
          >
            <Trash />
          </Button>
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
          class="w-full"
        />
      </div>

      <DialogFooter>
        <Button variant="secondary" @click="showDialog = false">Cancel</Button>
        <Button class="text-black" variant="destructive" @click="confirmSell"
          >Confirm</Button
        >
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
          class="w-full"
        />
      </div>

      <DialogFooter>
        <Button variant="secondary" @click="showBuyDialog = false"
          >Cancel</Button
        >
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

<script setup>
import { ref, computed } from "vue";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { accountOverview } from "@/lib/data.js"; // 引入你的API数据
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
import { ArrowDownUp } from "lucide-vue-next";
import {
  ChartNoAxesCombined,
  Inbox,
  ArrowBigDown,
  ArrowBigUp,
  Plus,
  Trash,
} from "lucide-vue-next";

// 卖出弹窗
const showDialog = ref(false);
const sellMode = ref("shares"); // "shares" or "amount"
const sellValue = ref("");
const selectedProduct = ref(null);

// 买入弹窗相关
const showBuyDialog = ref(false);
const buyMode = ref("shares");
const buyValue = ref("");

// 打开卖出弹窗
function openSellDialog(item) {
  selectedProduct.value = item;
  sellValue.value = "";
  sellMode.value = "shares";
  showDialog.value = true;
}

// 打开买入弹窗
function openBuyDialog(item) {
  selectedProduct.value = item;
  buyValue.value = "";
  buyMode.value = "shares";
  showBuyDialog.value = true;
}

// 确认卖出
function confirmSell() {
  console.log(
    `Selling ${sellValue.value} ${sellMode.value === "shares" ? "份额" : "金额"} of`,
    selectedProduct.value?.name,
  );
  showDialog.value = false;
}

// 确认买入
function confirmBuy() {
  console.log(
    `Buying ${buyValue.value} ${
      buyMode.value === "shares" ? "份额" : "金额"
    } of ${selectedProduct.value?.name}`,
  );
  showBuyDialog.value = false;
}

// 总资产计算
const totalValue = computed(() =>
  accountOverview.reduce(
    (sum, item) => sum + item.amount * item.current_price,
    0,
  ),
);
</script>

<style scoped>
.medium {
  padding: 20px;
  height: 100%;
  overflow-y: auto; /* 允许滚动 */
}
</style>
