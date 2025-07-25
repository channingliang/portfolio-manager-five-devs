<template>
  <div id="app">
    <!-- 顶部导航 -->
    <Header />
  </div>
  
  <!-- 中央内容区 -->
      <div class="container">
        <Portfolio />
      </div>

        <div>

          <router-view />
        </div>

</template>


<script setup>
import {Button} from "@/components/ui/button/index.js";

import Portfolio from "@/components/portfolio.vue";

import Header from '@/components/header.vue';

</script>



<style scoped>
/* 清除默认外边距和内边距 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100%; /* 确保整个页面填满视口 */
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 三栏均匀分布 */
  grid-template-areas: "left medium right"; /* 定义网格区域 */
  height: calc(100vh - 60px); /* 减去 header 的高度 */
}

.left {
  grid-area: left;
  overflow-y: auto; /* 允许左侧滚动 */
}

.medium {
  grid-area: medium;
  overflow-y: auto; /* 允许中间区域滚动 */
}

.right {
  grid-area: right;
  overflow-y: auto; /* 允许右侧滚动 */
}

.left, .medium, .right {
  padding: 50px;
  height: 100%; /* 使内容区域填满 */
}
</style>

