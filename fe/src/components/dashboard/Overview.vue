<template>
  <div class="line-chart-container">
    <!-- 折线图容器 -->
    <p>Financial Trends</p>
    <div ref="chartRef" class="chart-box"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, nextTick } from "vue";
import * as echarts from "echarts";
import { lineChartData } from "@/lib/data";

const chartRef = ref(null);
let myChart = null;

// 处理窗口大小变化
const handleResize = () => {
  if (myChart) {
    myChart.resize();
  }
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  // 销毁旧实例
  if (myChart) {
    myChart.dispose();
  }

  myChart = echarts.init(chartRef.value);

  // 从数据中提取图例名称
  const legendData = lineChartData.map((item) => item.name);
  // x 轴数据
  const xAxisData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const option = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    // 调整图例位置到下方
    legend: {
      data: legendData,
      bottom: 0,
      left: "center",
      orient: "horizontal",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: lineChartData.map((item) => ({
      name: item.name,
      type: "line",
      stack: "Total",
      data: item.data,
    })),
  };

  myChart.setOption(option);
};

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener("resize", handleResize);
  });
});

watchEffect(() => {
  if (lineChartData.length) {
    initChart();
  }
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  height: 400px;
  padding: 20px;
  box-sizing: border-box;
}

.chart-box {
  width: 100%;
  height: 100%;
}
</style>
