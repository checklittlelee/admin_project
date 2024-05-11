<template>
  <div class="consume-box">
    <div class="title">
      <p>游客消费统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let charts = ref()

onMounted(() => {
  let mychart = echarts.init(charts.value)
  let option: echarts.EChartOption = {
    title: {
      text: '',
      textStyle: {
        color: 'white'
      }
    },
    radar: {
      indicator: [
        { name: '住宿', max: 50 },
        { name: '餐饮', max: 50 },
        { name: '出行', max: 50 },
        { name: '特产', max: 50 },
        { name: '项目', max: 50 },
        { name: '门票', max: 50 }
      ]
    },
    legend: {
      data: ['30岁以下', '30-40岁', '40-50岁', '50-60岁'],
      textStyle: {
        color: 'white'
      },
      orient: 'vertical',
      right: 10
    },
    series: [
      {
        name: '',
        type: 'radar',
        data: [
          {
            value: [20, 18, 19, 7, 20, 31],
            name: '30岁以下'
          },
          {
            value: [42, 20, 20, 35, 5, 48],
            name: '30-40岁'
          },
          {
            value: [20, 14, 40, 37, 10, 21],
            name: '40-50岁'
          },
          {
            value: [50, 22, 19, 39, 8, 11],
            name: '50-60岁'
          }
        ]
      }
    ]
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.consume-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    p {
      font-size: 20px;
      color: white;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
