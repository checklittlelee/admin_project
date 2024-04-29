<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children">
        <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 只有一个子路由 -->
      <template v-if="item.children && item.children.length === 1">
        <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
          <template #title>
            <el-icon>
              <component :is="item.children[0].meta.icon"></component>
            </el-icon>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有大于一个子路由 -->
      <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <MenuView :menuList="item.children"></MenuView>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 获取父组件 Menu 传递过来的全部路由数组
defineProps(['menuList'])

// 获取路由器对象
let $router = useRouter()

// 点击菜单的回调
const goRoute = (vc: any) => {
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'MenuView'
}
</script>
