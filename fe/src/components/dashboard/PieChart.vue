<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { ChartPie } from "lucide-vue-next";
import api from "@/lib/request.js";
import eventBus from "@/lib/eventBus.js";
import { useAccountStore } from "@/stores/account.js"; // 需有全局 eventBus 实现

const accountStore = useAccountStore();

const chartRef = ref(null);
let chart = null;
const pieData = ref([]);
const accountId = accountStore.id;
const fontFamily = "Merriweather, serif";

function renderChart() {
  if (!chartRef.value) return;
  chart?.dispose();
  chart = echarts.init(chartRef.value);

  const total = pieData.value.reduce(
    (sum, item) => sum + Number(item.value),
    0,
  );

  chart.setOption({
    textStyle: { fontFamily },
    color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
    tooltip: {
      trigger: "item",
      formatter: ({ name, value }) => {
        const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return `${name}<br/>Per: ${pct}%<br/>Val: ${value}`;
      },
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
      left: "center",
      textStyle: { fontFamily },
    },
    series: [
      {
        type: "pie",
        radius: "60%",
        center: ["48%", "45%"],
        data: pieData.value,
        label: {
          show: true,
          formatter: ({ name, value }) => {
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${name}\n${pct}%`;
          },
          fontFamily,
        },
      },
    ],
  });
}

function fetchPieData() {
  api
    .get("/cash/summary", { account_id: accountId })
    .then((res) => {
      pieData.value = Array.isArray(res) ? res : [];
      renderChart();
    })
    .catch((e) => {
      pieData.value = [];
      renderChart();
    });
}

onMounted(() => {
  fetchPieData();
  window.addEventListener("resize", () => chart?.resize());
  eventBus.on("cash-updated", fetchPieData);
});
onUnmounted(() => {
  chart?.dispose();
  window.removeEventListener("resize", () => chart?.resize());
  eventBus.off("cash-updated", fetchPieData);
});

// 监听数据变化自动重渲染
watch(pieData, renderChart, { deep: true });
</script>

<template>
  <div
    class="z-888 mb-4 flex w-full items-center gap-1 rounded-2xl border-2 p-4 shadow-lg"
  >
    <ChartPie class="size-4" />
    Pie Chart
  </div>
  <div
    ref="chartRef"
    class="mx-auto min-h-[300px] w-auto rounded-2xl border-2 pt-4 pb-6 shadow-lg"
  />
</template>
