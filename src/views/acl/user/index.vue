<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请你输入要搜索的用户姓名" v-model="keyword" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
          <el-button type="primary" plain size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button type="danger" size="default" :disabled="!selectIdArr.length" @click="deleteSelectUsers"
        >批量删除</el-button
      >
      <!-- table展示用户信息 -->
      <el-table style="margin: 10px 0px" border :data="UserArr" @selection-change="selectChange">
        <el-table-column type="selection" width="50px" align="center"></el-table-column>
        <el-table-column label="#" width="50px" align="center" type="index"></el-table-column>
        <el-table-column label="ID" width="100px" align="center" prop="id"></el-table-column>
        <el-table-column label="用户昵称" align="center" prop="username"></el-table-column>
        <el-table-column label="用户姓名" align="center" prop="name"></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" icon="User" @click="setRole(scope.row)">分配角色</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="editUser(scope.row)">编辑</el-button>
            <el-popconfirm
              :title="`确定要删除${scope.row.name}吗？`"
              width="260px"
              @confirm="deleteUser(scope.row.id)"
              @cancel="drawer1 = false"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 10]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="sizeChange"
        @current-change="getHasUser"
      />
    </el-card>
    <!-- 抽屉组件--添加用户/编辑已有用户信息 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="name">
            <el-input placeholder="请您输入用户姓名" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="username">
            <el-input placeholder="请您输入用户昵称" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉组件--用户角色选择 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配用户角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              全选
            </el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :value="role">
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmRole">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqDeleteUser,
  reqDeleteUsers
} from '@/api/acl/user'
import type { User, Records, UserResponseData, AllRole, AllRoleResponseData, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let UserArr = ref<Records>([])
let drawer = ref<boolean>(false) // 用户信息抽屉
let drawer1 = ref<boolean>(false) // 角色选择抽屉
let userParams = reactive<User>({
  name: '',
  username: '',
  password: ''
})
let formRef = ref() // 获取el-form组件
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
let selectIdArr = ref<User[]>([]) // 复选框选中的用户ID，用于批量删除
let keyword = ref<string>('') // 搜索关键字
let settingStore = useLayOutSettingStore()

// 点击搜索按钮
const search = () => {
  // 根据关键字获取相应的用户数据
  getHasUser()
}
// 点击重置按钮
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    UserArr.value = result.data.records
  }
}
onMounted(() => {
  getHasUser()
})
const sizeChange = () => {
  getHasUser()
}
// 点击添加用户按钮
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    name: '',
    username: '',
    password: '',
    id: ''
  })
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('password')
  })
}

// table复选框勾选时触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
// 点击批量删除用户按钮
const deleteSelectUsers = async () => {
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let result: any = await reqDeleteUsers(idList)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

// 点击编辑按钮
const editUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('username')
  })
}
// 点击Drawer用户抽屉确认按钮
const confirm = async () => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '编辑成功' : '添加成功'
    })
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '编辑失败' : '添加失败'
    })
  }
}

// 自定义校验规则函数
const validatorName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('用户姓名长度至少两位'))
  }
}
const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称长度至少五位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}
// 表单校验需要的配置对象
const rules = {
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

// 点击分配角色按钮，打开抽屉
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code === 200) {
    allRole.value = result.data.allRolesList // 存储全部的职位
    userRole.value = result.data.assignRoles // 存储当前用户已有的职位
  }
  drawer1.value = true
}
// Drawer职位抽屉复选框
let checkAll = ref<boolean>(false) // 全选与否
let isIndeterminate = ref<boolean>(false) // 设置不确定状态，仅负责样式控制(短小横杠)
// 全选按钮变化时触发的事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false // 全选或全不选，不确定状态都为false
}
// 选择项变化时触发的事件
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length // 勾上所有选择项，全选自动勾上
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length // 除了全选和全不选外，不确定状态都为true
}
// 点击抽屉里分配角色抽屉确定按钮
const confirmRole = async () => {
  // 收集参数
  let data: SetRoleData = {
    roleIdList: userRole.value.map((item) => item.id as number),
    userId: userParams.id as number
  }
  // 发送请求
  let result: any = await reqSetUserRole(data)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '职位分配成功'
    })
    drawer1.value = false
    getHasUser()
  } else {
    ElMessage({
      type: 'error',
      message: '职位分配失败'
    })
  }
}

// 点击气泡确认框删除按钮
const deleteUser = async (userId: number) => {
  let result: any = await reqDeleteUser(userId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除用户成功'
    })
    getHasUser(UserArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除用户失败'
    })
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
