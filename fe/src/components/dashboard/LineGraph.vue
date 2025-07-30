<template>
  <div
    class="z-888 mb-4 flex w-full items-center gap-1 rounded-2xl border p-4 shadow-lg"
  >
    <ChartLine class="size-4" />
    Line Graph
  </div>
  <div
    ref="chartRef"
    class="min-h-[300px] w-full rounded-2xl border px-4 pb-6"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { lineChartData } from "@/lib/data";
import { ChartLine } from "lucide-vue-next";

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
    grid: { left: "3%", right: "3%", bottom: "12%", containLabel: true },
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
