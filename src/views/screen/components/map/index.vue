<template>
  <div class="map-box" ref="charts"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import chinaJSON from './china.json'

let charts = ref(null)

echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  let mychart = echarts.init(charts.value)
  let option: echarts.EChartOption = {
    geo: {
      map: 'china',
      left: '15%',
      top: '20%',
      right: '15%',
      zoom: 1.2,
      label: {
        show: true,
        color: 'white',
        fontSize: 14
      },
      itemStyle: {
        areaColor: '#023a80',
        opacity: 0.8,
        borderColor: 'white',
        shadowColor: 'rgba(135, 206, 250, 0.5)',
        shadowBlur: 20
      },
      emphasis: {
        itemStyle: {
          color: '#7c92b6'
        },
        label: {
          fontSize: 30,
          color: 'white'
        }
      }
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302] // 终点
            ],
            lineStyle: {
              color: 'white',
              width: 2
            }
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355] // 终点
            ],
            lineStyle: {
              color: 'white',
              width: 2
            }
          }
        ],
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'white',
          symbolSize: 8
        }
      }
    ]
  }
  mychart.setOption(option)
})
</script>

<style scoped></style>
