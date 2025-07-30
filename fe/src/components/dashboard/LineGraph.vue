<template>
  <div class="h-[350px] w-full">
    <p class="mb-2 font-semibold">Financial Trends</p>
    <div ref="chartRef" class="h-[300px] w-full" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { lineChartData } from "@/lib/data";

const chartRef = ref(null);
let chart = null;

const fontFamily = "Merriweather, serif";

function renderChart() {
  if (!chartRef.value) return;
  chart?.dispose();
  chart = echarts.init(chartRef.value);

  const legendData = lineChartData.map((item) => item.name);
  const xAxisData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  chart.setOption({
    textStyle: { fontFamily },
    tooltip: { trigger: "axis" },
    legend: { data: legendData, bottom: 0, left: "center" },
    grid: { left: "3%", right: "4%", bottom: "12%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: xAxisData },
    yAxis: { type: "value" },
    series: lineChartData.map((item) => ({
      name: item.name,
      type: "line",
      stack: "Total",
      data: item.data,
    })),
  });
}

onMounted(() => {
  renderChart();
  window.addEventListener("resize", () => chart?.resize());
});
onUnmounted(() => chart?.dispose());
watch(() => lineChartData, renderChart, { deep: true });
</script>
