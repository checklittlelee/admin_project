<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene !== 0" v-model="categoryStore.c1Id" @change="handler" style="width: 240px">
          <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene !== 0" v-model="categoryStore.c2Id" @change="handler1" style="width: 240px">
          <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene !== 0" v-model="categoryStore.c3Id" style="width: 240px">
          <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

// 通知仓库发请求 获取一级分类的数据
onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()
}

// 一级分类Select选择器下拉菜单选定一个值之后的回调函数，这时拿到一级分类ID去请求二级分类
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
// 二级分类Select选择器下拉菜单选定一个值之后的回调函数，这时拿到二级分类ID去请求三级分类
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}

// 接收父组件传递过来scene
defineProps(['scene'])
</script>

<style scoped></style>
