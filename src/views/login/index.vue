<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h2>欢迎来到商城研选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="default" @click="login"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let $router = useRouter()
let useStore = useUserStore()
let loginForms = ref() // 获取el-form组件

// 定义变量控制按钮加载效果
let loading = ref(false)
// 收集账号与密码
let loginForm = reactive({ username: 'admin', password: '111111' })
// 登录按钮回调
const login = async () => {
  await loginForms.value.validate() // 保证全部的表单项校验通过
  loading.value = true // 加载效果开始
  try {
    await useStore.userLogin(loginForm)
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi, ${getTime()}`
    })
    loading.value = false // 登录成功加载效果结束
  } catch (error) {
    loading.value = false // 登录失败加载效果结束
    ElNotification({
      type: 'error',
      message: (error as Error).message
    })
  }
}

// 自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}
// 表单校验需要的配置对象
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName } // 自定义
  ],
  password: [
    // {
    //   required: true,
    //   min: 6,
    //   max: 10,
    //   message: '账号长度至少6位',
    //   trigger: 'change'
    // }
    { trigger: 'change', validator: validatorPassword }
  ]
}
</script>

<style scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.png') no-repeat;
  background-size: cover;
  background-position: 50%;
  .login_form {
    position: relative;
    width: 30%;
    top: 45vh;
    left: 30vh;
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 20px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
