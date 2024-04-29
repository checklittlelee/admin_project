<template>
  <div class="layout_container">
    <div class="layout_slider">
      <Logo></Logo>
      <el-scrollbar class="scrollbar">
        <el-menu :default-active="$route.path" background-color="#001529" text-color="white">
          <MenuView :menuList="userStore.menuRoutes"></MenuView>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar">
      <Tabbar></Tabbar>
    </div>
    <div class="layout_main">
      <MainView></MainView>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import MenuView from './menu/index.vue'
import MainView from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useUserStore from '@/store/modules/user' // 获取用户相关

const userStore = useUserStore()
</script>

<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    position: fixed;
    top: 0px;
    left: $base-menu-width;
  }
  .layout_main {
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
  }
}
</style>
