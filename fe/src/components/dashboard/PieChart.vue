<template>
  <div
    class="z-888 mb-4 flex w-full items-center gap-1 rounded-2xl border p-4 shadow-lg"
  >
    <ChartPie class="size-4" />
    Pie Chart
  </div>
  <div
    ref="chartRef"
    class="mx-auto min-h-[300px] w-auto rounded-2xl border pt-4 pb-6 shadow-lg"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";
import { pieChartData } from "@/lib/data";
import { ChartPie } from "lucide-vue-next";

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
    legend: {
      orient: "horizontal",
      bottom: 0, // 或 'top'
      left: "center", // 居中对齐
    },
    series: [
      {
        type: "pie",
        radius: "60%",
        center: ["48%", "45%"],
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
