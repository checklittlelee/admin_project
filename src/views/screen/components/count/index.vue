<template>
  <div class="count-box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
      <p class="all">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill' // ECharts 扩展插件--水球图

let people = ref('215908人')

let charts = ref(null)

onMounted(() => {
  let mycharts: echarts.ECharts = echarts.init(charts.value)
  let option: echarts.EChartOption = {
    title: {},
    xAxis: {},
    yAxis: {},
    series: [
      {
        type: 'liquidFill',
        data: [0.215, 0.1, 0.685],
        radius: '85%'
      }
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.count-box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  .top {
    .title {
      color: white;
      font-size: 20px;
    }
    .all {
      float: right;
      color: white;
      font-size: 18px;
      margin: 10px 10px;
      span {
        color: #e3851a;
      }
    }
  }
  .number {
    padding: 10px;
    margin-top: 30px;
    display: flex;
    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      margin-top: 10px;
      font-size: 25px;
    }
  }
  .charts {
    width: 100%;
    height: 270px;
  }
}
</style>
