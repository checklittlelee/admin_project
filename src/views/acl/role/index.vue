<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="职位">
          <el-input placeholder="请你输入要搜索的职位名称" v-model="keyword" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="!keyword" @click="search">搜索</el-button>
          <el-button type="primary" plain size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">添加角色</el-button>
      <!-- table展示用户信息 -->
      <el-table style="margin: 10px 0px" border :data="allRole">
        <el-table-column label="#" width="50px" align="center" type="index"></el-table-column>
        <el-table-column label="ID" width="100px" align="center" prop="id"></el-table-column>
        <el-table-column label="职位名称" align="center" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" icon="User" @click="setPermission(scope.row)">分配权限</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="editRole(scope.row)">编辑</el-button>
            <el-popconfirm
              :title="`确定要删除${scope.row.roleName}吗？`"
              width="260px"
              @confirm="deleteRole(scope.row.id)"
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
        :page-sizes="[10, 15, 20, 30]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @size-change="sizeChange"
        @current-change="getHasRole"
      />
    </el-card>
    <!-- 对话框组件：添加/编辑职位 -->
    <el-dialog v-model="dialogFormVisible" :title="RoleParams.id ? '编辑职位' : '添加职位'" width="800">
      <el-form :model="RoleParams" :rules="rules" ref="formRef">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit"> 确定 </el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件：分配用户的菜单权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <!-- Tree树形控件 -->
        <el-tree
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="tree"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="savePermission">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllPermissionList,
  reqSetPermission,
  reqDeleteRole
} from '@/api/acl/role'
import type { RoleData, Records, RoleResponseData, MenuResponseData, MenuList, MenuData } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0) // 符合关键字的职位的数量
let keyword = ref<string>('') // 搜索关键字
let formRef = ref() // 获取el-form组件
let allRole = ref<Records>([]) // 存储全部已有职位
let settingStore = useLayOutSettingStore()
let dialogFormVisible = ref<boolean>(false) // 控制对话框的显示与隐藏
let RoleParams = reactive<RoleData>({
  roleName: ''
})
let drawer = ref<boolean>(false)
let menuArr = ref<MenuList>([]) // 存储用户权限的数组
let selectArr = ref<number[]>([]) // 数组用于存储勾选的节点的ID(第四级)
let tree = ref<any>()

// 点击搜索按钮
const search = () => {
  getHasRole()
}
// 点击重置按钮
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
onMounted(() => {
  getHasRole()
})
const sizeChange = () => {
  getHasRole()
}
// 点击添加职位按钮
const addRole = () => {
  dialogFormVisible.value = true
  Object.assign(RoleParams, {
    roleName: '',
    id: ''
  })
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  })
}
// 点击分配权限按钮
const setPermission = async (row: RoleData) => {
  Object.assign(RoleParams, row) // 存一下
  let result: MenuResponseData = await reqAllPermissionList(RoleParams.id as number)
  if (result.code === 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
  drawer.value = true
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: MenuData) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
// 点击抽屉组件中确定按钮
const savePermission = async () => {
  const roleId = RoleParams.id as number
  let arr = tree.value.getCheckedKeys() // 选中节点的ID
  let arr1 = tree.value.getHalfCheckedKeys() // 半选的ID
  let permissionId = arr.concat(arr1)
  let result: any = await reqSetPermission(roleId, permissionId)
  if (result.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '权限分配成功'
    })
  }
}

// 点击编辑按钮
const editRole = (row: RoleData) => {
  dialogFormVisible.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  })
}

// 自定义校验规则函数
const validatorRoleName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称长度至少两位'))
  }
}
// 表单校验需要的配置对象
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }]
}

// 点击对话框中确认按钮
const confirmEdit = async () => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code === 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '编辑成功' : '添加成功'
    })
    getHasRole(RoleParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '编辑失败' : '添加失败'
    })
  }
}

// 树形控件测试数据
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 点击删除按钮
const deleteRole = async (id: number) => {
  let result: any = await reqDeleteRole(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
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
