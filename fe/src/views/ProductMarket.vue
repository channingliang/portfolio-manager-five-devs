<template>
  <div class="products-market p-6 flex flex-col gap-4">
    <!-- 顶部搜索框 -->
    <div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索股票或基金"
        class="w-full rounded border px-3 py-2"
      />
    </div>

    <!-- 标题 -->
    <h1 class="text-xl font-bold mb-2">产品市场</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-gray-500">加载中...</div>

    <!-- 错误状态 -->
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- 产品列表 -->
    <div
      v-if="!loading && !error"
      class="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="rounded border p-4 shadow transition hover:shadow-lg"
      >
        <h2 class="text-base font-semibold">{{ product.name }}</h2>
        <p class="text-xs text-gray-600">类型: {{ product.type }}</p>
        <p class="font-bold text-xs text-gray-800">价格: ${{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";


// 状态管理
const products = ref([
  { id: 1, name: "华夏成长基金", type: "基金", price: 3.25 },
  { id: 2, name: "贵州茅台", type: "股票", price: 1680.50 },
  { id: 3, name: "招商银行", type: "股票", price: 32.80 },
  { id: 4, name: "易方达蓝筹", type: "基金", price: 2.98 },
  { id: 5, name: "宁德时代", type: "股票", price: 210.10 },
  { id: 6, name: "中证500ETF", type: "基金", price: 5.12 },
]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref("");

// 过滤后的产品列表
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// 模拟 API 地址（替换成你真实的 API）
const API_URL = "https://api.example.com/products";

// 页面加载时获取产品数据
onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get(API_URL);
    products.value = response.data; // 假设 API 返回数组
  } catch (err) {
    error.value = "获取产品信息失败，请稍后再试";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.products-market {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
