<template>
  <div class="year-box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref(null)

onMounted(() => {
  let mychart: echarts.ECharts = echarts.init(charts.value)
  let option: echarts.EChartOption = {
    title: {
      text: '2024年排名(10万)',
      link: 'http://www.baidu.com',
      left: '50%',
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20
      },
      subtext: '杭州西湖景区',
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 16
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70, 50, 60, 80],
        label: {
          show: true,
          position: 'insideTop',
          color: 'yellowgreen'
        }
      },
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60, 70, 50, 60, 80],
        smooth: true
      }
    ],
    grid: {
      left: 30,
      bottom: 20,
      right: 20
    },
    tooltip: {
      backgroundColor: 'rgba(50,50,50,0.7)'
    }
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.year-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
