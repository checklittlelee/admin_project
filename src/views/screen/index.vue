<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Count class="count" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Predict class="predict" />
        </div>
        <div class="right">
          <Visit class="visit" />
          <Year class="year" />
          <Consume class="consume" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 数据大屏顶部
import Top from './components/top/index.vue'
// 数据大屏下方 左侧
import Count from './components/count/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
// 数据大屏下方 中间
import Map from './components/map/index.vue'
import Predict from './components/predict/index.vue'
// 数据大屏下方 右侧
import Visit from './components/visit/index.vue'
import Year from './components/year/index.vue'
import Consume from './components/consume/index.vue'

let screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})
// 定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
// 监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        .count {
          flex: 1;
          margin: 5px 0px;
        }
        .sex {
          flex: 1;
          margin: 5px 0px;
        }
        .age {
          flex: 1;
          margin: 5px 0px;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        margin: 5px 5px;
        .map {
          flex: 3;
        }
        .predict {
          flex: 1;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        .visit {
          flex: 1;
          margin: 5px 0px;
        }
        .year {
          flex: 1;
          margin: 5px 0px;
        }
        .consume {
          flex: 1;
          margin: 5px 0px;
        }
      }
    }
  }
}
</style>
