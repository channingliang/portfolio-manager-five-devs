<template>
  <div class="products-market p-6">
    <h1 class="text-2xl font-bold mb-4">产品市场</h1>

    <!-- 搜索框 -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索股票或基金"
        class="border rounded px-3 py-2 w-full"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-gray-500">加载中...</div>

    <!-- 错误状态 -->
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <!-- 产品列表 -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="border p-4 rounded shadow hover:shadow-lg transition"
      >
        <h2 class="text-lg font-semibold">{{ product.name }}</h2>
        <p class="text-gray-600">类型: {{ product.type }}</p>
        <p class="text-gray-800 font-bold">价格: ${{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 状态管理
const products = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')

// 过滤后的产品列表
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 模拟 API 地址（替换成你真实的 API）
const API_URL = 'https://api.example.com/products'

// 页面加载时获取产品数据
onMounted(async () => {
  loading.value = true
  try {
    const response = await axios.get(API_URL)
    products.value = response.data // 假设 API 返回数组
  } catch (err) {
    error.value = '获取产品信息失败，请稍后再试'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.products-market {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
