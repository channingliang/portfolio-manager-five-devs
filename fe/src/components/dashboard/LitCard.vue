<template>
  <div class="p-4">
    <!-- 标题 -->
    <h2 class="mb-4 text-xl font-semibold text-gray-900">Account Overview</h2>

    <!-- 现金资产行 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- 钱包图标 -->
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
          <path
            d="M19 7V4a1 1 0 0 0-1-1H4a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
          />
          <path d="M3 12v7a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
        <span class="text-gray-600">Cash Assets</span>
      </div>

      <!-- 金额 -->
      <div class="font-bold text-gray-900">￥386,524.85</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountOverview",
  // 如果需要动态数据可以通过props传入
  props: {
    balance: {
      type: Number,
      default: 386524.85,
    },
  },
  computed: {
    formattedBalance() {
      return `￥${this.balance.toLocaleString("zh-CN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
};
</script>
