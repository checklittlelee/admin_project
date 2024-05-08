<template>
  <div>
    <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" :disabled="scope.row.level == 4" @click="addMenu(scope.row)">
            {{ scope.row.level == 3 || scope.row.level == 4 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button type="primary" size="small" @click="editMenu(scope.row)">编辑</el-button>
          <el-popconfirm :title="`确定要删除${scope.row.name}吗？`" width="260px" @confirm="deleteMenu(scope.row.id)">
            <template #reference>
              <el-button type="primary" size="small" :disabled="scope.row.level == 1">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件：添加/编辑菜单 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '编辑菜单' : '添加菜单'" width="500">
      <el-form>
        <el-form-item label="菜单名称">
          <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input placeholder="请你输入权限值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { reqAllPermission, reqAddOrUpdateMenu, reqDeleteMenu } from '@/api/acl/menu'
import type { Permission, PermissionList, PermissionResponse, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let PermissionArr = ref<PermissionList>([])
let dialogVisible = ref<boolean>(false) // 控制对话框的显示与隐藏
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
})

const getHasPermission = async () => {
  let result: PermissionResponse = await reqAllPermission()
  if (result.code === 200) {
    PermissionArr.value = result.data
  }
}
onMounted(() => {
  getHasPermission()
})
const addMenu = (row: Permission) => {
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id as number
}
const editMenu = (row: Permission) => {
  Object.assign(menuData, row)
  dialogVisible.value = true
}
// 点击对话框中的确定按钮
const save = async () => {
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code === 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '编辑成功' : '添加成功'
    })
    getHasPermission()
  }
}
// 点击删除按钮
const deleteMenu = async (id: number) => {
  let result = await reqDeleteMenu(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasPermission()
  }
}
</script>

<style scoped></style>
