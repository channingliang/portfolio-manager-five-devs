<script setup>
import { onMounted, onBeforeUnmount, watch, ref, nextTick } from "vue";
import * as echarts from "echarts";

// Props: klineData (array), chartId (string)
const props = defineProps({
  klineData: { type: Array, required: true },
  chartId: { type: String, required: true },
});

let chart = null;

const renderChart = () => {
  if (!props.klineData.length) return;
  nextTick(() => {
    const dom = document.getElementById(props.chartId);
    if (!dom) return;
    if (dom._echarts_instance_) {
      echarts.dispose(dom);
    }
    chart = echarts.init(dom);
    const dates = props.klineData.map((d) => d.date?.substring(0, 10));
    const values = props.klineData.map((d) => [d.open, d.close, d.low, d.high]);
    chart.setOption({
      textStyle: {
        fontFamily: "Merriweather, serif",
      },
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
  });
};

onMounted(() => {
  renderChart();
});
onBeforeUnmount(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
watch(
  () => props.klineData,
  () => renderChart(),
);
</script>

<template>
  <div :id="chartId" style="height: 320px; width: 100%"></div>
</template>
