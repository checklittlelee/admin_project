<template>
  <div class="predict-box">
    <div class="title">
      <p>未来25天游客数量趋势图</p>
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
  let mycharts = echarts.init(charts.value)
  let option: echarts.EChartOption = {
    title: {
      text: ''
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false
      },
      data: [
        '5/5',
        '5/7',
        '5/9',
        '5/11',
        '5/13',
        '5/15',
        '5/17',
        '5/19',
        '5/21',
        '5/23',
        '5/25',
        '5/27',
        '5/29',
        '5/31'
      ],
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40,
      top: 10,
      right: 40,
      bottom: 20
    },
    series: [
      {
        type: 'line',
        data: [1900, 1240, 300, 546, 985, 890, 1109, 1340, 1000, 800, 999, 1300, 1340, 1500],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#F7D631'
              },
              {
                offset: 1,
                color: 'rgba(0, 0, 0, 0.2)'
              }
            ],
            global: false
          }
        }
      }
    ]
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.predict-box {
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
    height: calc(100% - 40px);
  }
}
</style>
