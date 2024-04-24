<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting.ts'
let layoutSettingStore = useLayOutSettingStore()

// 控制当前组件是否销毁重建
let flag = ref(true)

// 监听仓库内部数据是否发生变化，如果发生变化，说明用户点击了
watch(
  () => layoutSettingStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
</script>
<script lang="ts">
export default {
  name: 'Main'
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
