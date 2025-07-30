<script setup>
import { onMounted, watch, ref } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  klineData: { type: Array, required: true },
  chartId: { type: String, required: true },
});

let chartInstance = null;

const renderChart = () => {
  const dom = document.getElementById(props.chartId);
  if (!dom) return;
  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance = echarts.init(dom);

  const data = props.klineData || [];
  const dates = data.map((d) => d.date?.slice(0, 10));
  const values = data.map((d) => [d.open, d.close, d.low, d.high]);

  chartInstance.setOption({
    textStyle: { fontFamily: "Merriweather, serif" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: dates, boundaryGap: false },
    yAxis: { scale: true },
    series: [
      {
        type: "candlestick",
        data: values,
      },
    ],
    grid: { left: 40, right: 16, top: 16, bottom: 24 },
  });
};

onMounted(() => {
  renderChart();
});
watch(
  () => props.klineData,
  () => {
    renderChart();
  },
);
watch(
  () => props.chartId,
  () => {
    renderChart();
  },
);
</script>

<template>
  <div :id="chartId" class="w-full" style="height: 320px"></div>
</template>
