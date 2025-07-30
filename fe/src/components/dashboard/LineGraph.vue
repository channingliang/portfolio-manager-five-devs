<template>
  <div
    class="z-888 mb-4 flex w-full items-center gap-1 rounded-2xl border p-4 shadow-lg"
  >
    <ChartLine class="size-4" />
    Line Graph
  </div>
  <div
    ref="chartRef"
    class="min-h-[300px] w-full rounded-2xl border px-4 pb-6 shadow-lg"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { ChartLine } from "lucide-vue-next";
import api from "@/lib/request.js";
import eventBus from "@/lib/eventBus.js";

const chartRef = ref(null);
let chart = null;

const fontFamily = "Merriweather, serif";
const chartData = ref([]);

// x轴显示：最近14天
function getXAxis() {
  // 近14天日期 ["07-17", ..., "07-30"]
  const days = 14;
  const arr = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    arr.push(
      `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`,
    );
  }
  return arr;
}

function renderChart() {
  if (!chartRef.value) return;
  chart?.dispose();
  chart = echarts.init(chartRef.value);

  const legendData = chartData.value.map((item) => item.name);
  const xAxisData = getXAxis();

  chart.setOption({
    textStyle: { fontFamily },
    tooltip: { trigger: "axis" },
    legend: { data: legendData, bottom: 0, left: "center" },
    grid: { left: "3%", right: "3%", bottom: "12%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: xAxisData },
    yAxis: { type: "value" },
    series: chartData.value.map((item) => ({
      name: item.name,
      type: "line",
      data: item.data,
    })),
  });
}

// 拉取真实数据
const fetchData = () => {
  api
    .get("/portfolio/summary", { account_id: 1 })
    .then((res) => {
      chartData.value = Array.isArray(res) ? res : [];
      renderChart();
    })
    .catch((err) => {
      chartData.value = [];
      renderChart();
      console.error("Failed to load line chart data:", err);
    });
};

onMounted(() => {
  fetchData();
  window.addEventListener("resize", () => chart?.resize());
  // 监听买卖导致的资产变化，自动刷新折线图
  eventBus.on("cash-updated", fetchData);
});
onUnmounted(() => {
  chart?.dispose();
  eventBus.off("cash-updated", fetchData);
});
watch(chartData, renderChart, { deep: true });
</script>
