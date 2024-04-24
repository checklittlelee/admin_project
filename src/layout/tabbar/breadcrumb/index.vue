<template>
  <!-- 图标 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" :to="item.path" v-show="item.meta.title">
      <el-icon style="margin: 0px 4px; vertical-align: top"><component :is="item.meta.icon"></component></el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
    <!-- <el-breadcrumb-item>用户管理</el-breadcrumb-item> -->
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 折叠 todo
let fold = ref(false)
const changeIcon = () => {
  fold.value = !fold.value
}

// 动态面包屑
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>
