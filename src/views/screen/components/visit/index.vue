<template>
  <div class="visit-box">
    <div class="title">
      <p>西湖景区日游客量散点图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let charts = ref(null)

onMounted(() => {
  let mychart = echarts.init(charts.value)
  let option: echarts.EChartOption = {
    title: {
      text: '',
      left: '40%',
      textStyle: {
        color: 'white'
      }
    },
    xAxis: {
      type: 'category',
      show: true
    },
    yAxis: {
      show: false
    },
    grid: {
      left: 20,
      top: 20,
      right: 0,
      bottom: 20
    },
    series: [
      {
        type: 'scatter',
        data: [
          88, 24, 5, 10, 68, 298, 459, 676, 780, 999, 1320, 1560, 1680, 1570, 1666, 1780, 1900, 1560, 1200, 1309, 898,
          468, 348, 109
        ],
        symbol: 'diamond',
        symbolSize: 12,
        label: {
          show: true,
          position: 'top',
          color: 'white'
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#7c92b6'
              },
              {
                offset: 1,
                color: 'skyblue'
              }
            ],
            global: false
          }
        }
      }
    ]
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.visit-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
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
