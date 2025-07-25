<template>
  <nav>
    <ul>
  <!-- 顶部导航区 -->
    <header class="bg-primary text-white header">
        <div class="flex items-center space-x-2">
          <!-- Logo 使用金色图标 -->
            <span class="iconify text-4xl text-yellow-500" data-icon="noto:money-bag" id="1" alt="金袋logo, 一个有金钱符号的袋子"></span>
            <h1 class="text-2xl font-bold">Five Devs</h1>
        </div>
            
      <!-- 主导航 -->
       <nav class="flex space-x-8 text-lg">
                <a href="#" class="font-bold border-b-2 border-yellow-500 pb-1">账户总览</a>
                <a href="#" class="hover:text-gray-300 transition-colors">产品市场</a>
                <a href="#" class="hover:text-gray-300 transition-colors">帮助中心</a>
            </nav>

            
      <!-- 用户区域 -->
       <div class="flex items-center space-x-4">
            <button class="bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors">                
              <span class="iconify inline-block text-xl" data-icon="solar:bell-outline" id="2" alt="通知铃铛图标"></span>
            </button>
           <div class="flex items-center bg-gray-700 hover:bg-gray-600 rounded-xl p-2 cursor-pointer transition-colors">
                <span class="iconify text-xl" data-icon="carbon:user-avatar" id="3" alt="用户头像"></span>
                <span class="ml-2">张经理</span>
                 <span class="iconify ml-2" data-icon="ep:arrow-down" id="4" alt="下拉箭头"></span>
            </div>
        </div>
    </header>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
.bg-primary {
  background-color: #1a2b3c;
}
.text-primary {
  color: #1a2b3c;
}

.header {
  position: fixed; /* 固定header在顶部 */
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-around; /* 使导航项均匀分布 */
  padding: 0 20px; /* 给两边添加一些内边距 */
  z-index: 10; /* 确保 header 在所有内容上方 */
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav ul li {
  margin: 0 15px;
}


nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>
