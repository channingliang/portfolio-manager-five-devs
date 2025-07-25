<script setup>
import DataTable from "@/components/dashboard/DataTable.vue";

//import CustomCard from "@/components/dashboard/CustomCard.vue";

// import api from "@/lib/request.js";

// Example API call to fetch data
// api.get("/posts/1")
//   .then((response) => {
//     console.log("Dashboard data:", response.data);
//   })
//   .catch((error) => {
//     console.error("Error fetching dashboard data:", error);
//   });
// 1. 导入子组件

// 2. 注册子组件 (直接在 <script setup> 中导入即可，无需 components 选项)
import { ref } from "vue";
import LitCard from "@/components/dashboard/LitCard.vue";
import PieChart from "@/components/dashboard/PieChart.vue";
import Overview from "@/components/dashboard/Overview.vue";
const userBalance = ref(386524.85); // 从API或其他地方获取的实际金额
</script>

<template>
  <div>
    <div class="flex min-h-screen flex-col gap-4 bg-gray-50 p-4">
      <!-- LitCard 和 DataTable 之间无间隔，贴在一起 -->
      <LitCard :balance="500000.5" />
      <DataTable />
    </div>
  </div>
  <div>
    <PieChart />
    <Overview />
  </div>
</template>

<style scoped></style>
