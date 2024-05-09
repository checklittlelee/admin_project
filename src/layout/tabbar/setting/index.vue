<template>
  <el-button size="small" circle icon="Refresh" @click="updateRefresh"></el-button>
  <el-button size="small" circle icon="FullScreen" @click="fullScreen"></el-button>
  <!-- Popover 气泡卡片组件--设置 -->
  <el-popover title="主题设置" :width="300" trigger="hover">
    <!-- 里面的表单form组件 -->
    <el-form>
      <el-form-item label="主题颜色：">
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="暗黑模式：">
        <el-switch
          @change="changeDark"
          v-model="dark"
          size="small"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" circle icon="Setting"></el-button>
    </template>
  </el-popover>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user.ts'
import useLayOutSettingStore from '@/store/modules/setting.ts'
let layoutSettingStore = useLayOutSettingStore()
let dark = ref<boolean>(false) // 暗黑模式开关

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

// 颜色组件
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
// color-picker取色器的change事件--主题颜色设置
const setColor = () => {
  // 通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
// switch开关的change事件--暗黑模式切换
const changeDark = () => {
  let html = document.documentElement
  html.className = dark.value ? 'dark' : ''
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
