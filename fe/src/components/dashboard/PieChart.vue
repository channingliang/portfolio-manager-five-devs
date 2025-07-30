<template>
  <div class="pie-chart-container">
    <!-- 饼图容器 -->
    <p>Data Statistics</p>
    <div ref="chartRef" class="chart-box"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, nextTick } from "vue";
import * as echarts from "echarts";
import { pieChartData } from "@/lib/data";

const chartRef = ref(null);
let myChart = null;

// 响应式调整图表大小
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

  // 初始化图表
  myChart = echarts.init(chartRef.value);

  // 计算总和
  const total = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    color: ["#5470c6", "#91cc75", "#fac858"], // 自定义颜色
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "item",
      // 自定义tooltip内容
      formatter: ({ name, value }) => {
        const percentage = ((value / total) * 100).toFixed(1);
        return `${name}<br/>占比: ${percentage}%<br/>数值: ${value}`;
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      // 若需要隐藏图例，可设置 show: false
      // show: false
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%", // 改为单一值，显示为普通饼图，可根据需求调整大小
        center: ["50%", "50%"],
        data: pieChartData,
        label: {
          show: true,
          // 自定义标签格式：名称 + 百分比
          formatter: ({ name, value }) => {
            const percentage = ((value / total) * 100).toFixed(1);
            return `${name}\n${percentage}%`;
          },
          rich: {
            // 自定义标签样式
            name: {
              fontSize: 14,
              fontWeight: "bold",
            },
            value: {
              fontSize: 12,
              color: "#666",
            },
          },
        },
        labelLine: {
          show: true,
        },
      },
    ],
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
  if (pieChartData.length) {
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
.pie-chart-container {
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
