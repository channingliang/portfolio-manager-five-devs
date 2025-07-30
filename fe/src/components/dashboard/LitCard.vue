<template>
  <!-- 现金账户概览卡片 -->
  <div class="rounded-lg bg-white p-4 shadow-sm">
    <!-- 卡片标题 -->
    <h2 class="mb-4 text-xl font-semibold text-gray-900">Account Overview</h2>

    <!-- 现金资产信息行 -->
    <div class="flex items-center justify-between">
      <!-- 左侧：图标与标签 -->
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-wallet-minimal-icon lucide-wallet-minimal"
        >
          <path d="M17 14h.01" />
          <path
            d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"
          />
        </svg>

        <span class="text-gray-700">Cash</span>
      </div>

      <!-- 右侧：格式化的金额 -->
      <div class="text-lg font-medium text-gray-900">
        {{ formattedBalance }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAccountStore } from "@/stores/account.js"; // 引入状态管理

// 定义组件属性
const props = defineProps({
  /**
   * 货币符号
   * @type {String}
   * @default '' 人民币符号
   */
  currencySymbol: {
    type: String,
    default: "$", // 使用美元符号
  },
});

// 从全局状态中获取余额
const currentBalance = computed(() => {
  // 增加空值处理，避免为null时调用toLocaleString报错
  const balance = useAccountStore().balance;
  return balance ?? "/"; // 如果为null/undefined，默认显示/
});

// 格式化余额显示
const formattedBalance = computed(() => {
  // 处理占位符情况，避免对非数字调用toLocaleString
  if (currentBalance.value === "/") {
    return currentBalance.value;
  }

  return `${props.currencySymbol}${currentBalance.value.toLocaleString(
    "zh-CN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
});
</script>
