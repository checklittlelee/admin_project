<template>
  <div class="age-box">
    <div class="title">
      <p>年龄比例</p>
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

  // 百分比的计算
  const rawData = [
    { value: 16, name: '10岁以下' },
    { value: 8, name: '10-18岁' },
    { value: 12, name: '18-30岁' },
    { value: 24, name: '30-40岁' },
    { value: 20, name: '40-60岁' },
    { value: 20, name: '60岁以上' }
  ]
  let total = rawData.reduce((acc, curr) => acc + curr.value, 0)
  const seriesData = rawData.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(2)
  }))

  let option: echarts.EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)' // 添加格式化工具提示显示百分比
    },
    legend: {
      right: '10%',
      top: '20%',
      orient: 'vertical', //图例组件方向的设置
      textStyle: {
        color: 'white',
        fontSize: 14
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        center: ['40%', '50%'], // 第一个值是水平位置，第二个值是垂直位置
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          formatter: function (params: any) {
            return params.percent.toFixed(2) + '%'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData.map((item) => ({ value: item.value, name: item.name }))
      }
    ]
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.age-box {
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
    height: 260px;
  }
}
</style>
