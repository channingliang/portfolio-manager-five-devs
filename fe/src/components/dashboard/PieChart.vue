<template>
  <div class="mx-auto h-full w-full">
    <div ref="chartRef" class="h-[50vh] w-auto" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { pieChartData } from "@/lib/data";

const chartRef = ref(null);
let chart = null;

// 统一字体
const fontFamily = "Merriweather, serif";

// 渲染/重渲染
function renderChart() {
  if (!chartRef.value) return;
  chart?.dispose();
  chart = echarts.init(chartRef.value);

  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  chart.setOption({
    textStyle: { fontFamily },
    color: ["#5470c6", "#91cc75", "#fac858"],
    tooltip: {
      trigger: "item",
      formatter: ({ name, value }) => {
        const pct = ((value / total) * 100).toFixed(1);
        return `${name}<br/>占比: ${pct}%<br/>数值: ${value}`;
      },
    },
    legend: { orient: "vertical", left: "left" },
    series: [
      {
        type: "pie",
        radius: "60%",
        center: ["63%", "55%"],
        data: pieChartData,
        label: {
          show: true,
          formatter: ({ name, value }) => {
            const pct = ((value / total) * 100).toFixed(1);
            return `${name}\n${pct}%`;
          },
          fontFamily,
        },
      },
    ],
  });
}

onMounted(() => {
  renderChart();
  window.addEventListener("resize", () => chart?.resize());
});
onUnmounted(() => chart?.dispose());
watch(() => pieChartData, renderChart, { deep: true });
</script>
