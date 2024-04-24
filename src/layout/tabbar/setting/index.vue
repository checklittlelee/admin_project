<template>
  <el-button
    size="small"
    circle
    icon="Refresh"
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    circle
    icon="FullScreen"
    @click="fullScreen"
  ></el-button>
  <el-button size="small" circle icon="Setting"></el-button>
  <img :src="userStore.avatar" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user.ts'
import useLayOutSettingStore from '@/store/modules/setting.ts'
let layoutSettingStore = useLayOutSettingStore()

// 刷新按钮回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
// 全屏按钮回调
const fullScreen = () => {
  let full = document.fullscreenElement // DOM对象的一个属性：用来判断当前是否为全屏
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
// 用户名 头像
const userStore = useUserStore()
const $router = useRouter()
// 退出登录
const logout = async () => {
  // 第一件事：向服务器发请求，告诉服务器该token不要了，下次登录要新的
  // 第二件事：仓库中关于用户的信息清空
  // 第三件事：跳转到登录页面
  await userStore.userLogout()
  $router.push({ path: '/login' })
}
</script>
<script lang="ts">
export default {
  name: 'Setting'
}
</script>

<style scoped>
img {
  width: 30px;
  height: 30px;
  margin: 0px 10px;
  border-radius: 50%;
}
</style>
