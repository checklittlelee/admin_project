<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <!-- 展示区 -->
    <el-card style="margin: 10px 0">
      <!-- 展示区--属性名称、属性值名称、属性值操作（删除 编辑按钮） -->
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id" @click="addAttr"
          >添加平台属性</el-button
        >
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="90px"></el-table-column>
          <el-table-column label="属性名称" width="150px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="scope">
              <el-tag v-for="item in scope.row.attrValueList" :key="item.id">{{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" width="150px">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(scope.row)"></el-button>
              <el-popconfirm
                :title="`你确定要删除${scope.row.attrName}吗？`"
                @confirm="deleteAttr(scope.row.id)"
                width="200px"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 展示区--添加与修改（点击编辑按钮后） -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="!attrParams.attrName" type="primary" size="default" icon="Plus"
          >添加属性值</el-button
        >
        <el-button type="primary" size="default" icon="Close" @click="cancel">取消</el-button>
        <!-- 属性值列表 -->
        <el-table border style="margin: 10px 0px" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="scope">
              <!-- 输入框编辑模式 -->
              <el-input
                :ref="(vc: any) => (inputArr[scope.$index] = vc)"
                size="small"
                v-if="scope.row.flag"
                placeholder="请你输入属性值名称"
                v-model="scope.row.valueName"
                @blur="toLook(scope.row, scope.$index)"
              ></el-input>
              <!-- 失焦查看模式 -->
              <div v-else @click="toEdit(scope.row, scope.$index)">{{ scope.row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice(scope.$index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save" :disabled="attrParams.attrValueList.length <= 0"
          >保存</el-button
        >
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])
let scene = ref<number>(0) // 定义card组件内容切换的变量 scene=0，显示属性与属性值table；scene=1，展示添加与修改
let attrParams = reactive<Attr>({
  attrName: '', // 新增的属性名
  attrValueList: [], // 新增的属性值数组
  categoryId: '', // 三级分类的ID
  categoryLevel: 3 // 三级分类
})
let inputArr = ref<any>([]) // 准备一个空数组，将来存储对应组件实例el-input

// 监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 确保三级分类ID有值才发请求
    if (!categoryStore.c3Id) return
    getAttr()
  }
)
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 点击添加属性按钮
const addAttr = () => {
  Object.assign(attrParams, {
    attrName: '', // 新增的属性名
    attrValueList: [], // 新增的属性值数组
    categoryId: categoryStore.c3Id, // 收集三级分类ID
    categoryLevel: 3 // 三级分类
  })
  scene.value = 1
}
// 点击修改已有属性的编辑按钮
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象赋值给attrParams对象即可
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 点击取消按钮
const cancel = () => {
  scene.value = 0
}

// 添加属性值按钮
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true // 控制每一个属性值的编辑模式与查看模式的切换
  })
  // 获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 点击保存按钮
const save = async () => {
  // 收集参数 发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    scene.value = 0 // 切换场景
    ElMessage({ type: 'success', message: attrParams.id ? '修改成功' : '添加成功' })
    getAttr()
  } else {
    ElMessage({ type: 'error', message: attrParams.id ? '修改失败' : '添加失败' })
  }
}

// 属性值表单元素 input失去焦点 切换到查看模式
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况一
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1) // 删除对应属性值为空的元素
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return false
  }
  // 非法情况二
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1) // 删除对应属性值重复的元素
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }

  row.flag = false
}
// 属性值表单元素 点击div 切换到编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // nextTick: 响应式数据发生变化，获取更新后的DOM（组件实例）
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 点击删除某一个已有属性按钮
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

// 路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
