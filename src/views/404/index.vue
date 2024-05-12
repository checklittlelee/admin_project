<template>
  <div class="error">
    <el-result icon="warning" title="404提示" sub-title="该页面不存在">
      <template #extra>
        <el-button type="primary" @click="$router.push('/home')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
let path = localStorage.getItem('path')
console.log('404', path)
</script>

<style lang="scss" scoped></style>
