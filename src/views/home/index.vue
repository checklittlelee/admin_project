<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <div class="content">
          <h3 class="title">{{ getTime() }}{{ userStore.username }}</h3>
          <p class="subtitle">商城研选后台管理</p>
        </div>
      </div>
    </el-card>
    <div class="bottom">
      <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

let userStore = useUserStore()
</script>

<style scoped>
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}
.content {
  margin-left: 20px;
  .title {
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 30px;
  }
  .subtitle {
    font-size: italic;
    color: grey;
  }
}
.bottom {
  margin-top: 260px;
  display: flex;
  justify-content: center;
}
</style>
