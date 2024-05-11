<template>
  <div class="sex-box">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
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
      text: '',
      textStyle: {
        color: 'skyblue'
      },
      left: 'center'
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: '#007afe',
          borderRadius: 20
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: '#ff4b7a',
          borderRadius: 20
        }
      }
    ]
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.sex-box {
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
  .sex {
    display: flex;
    justify-content: center;
    color: #e3851a;
    .man {
      margin: 20px;
      width: 110px;
      height: 110px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .women {
      margin: 20px;
      width: 110px;
      height: 110px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .rate {
    margin: 0px 30px;
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 20px;
  }
  .charts {
    margin: 0px 30px;
    height: 80px;
  }
}
</style>
