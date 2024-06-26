<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <!-- 展示区 -->
    <el-card style="margin: 10px 0px">
      <!-- 场景0: 显示已有SPU -->
      <div v-show="scene == 0">
        <el-button @click="addSpu" type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id"
          >添加SPU</el-button
        >
        <!-- 展示区：已有SPU数据 -->
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(scope.row)"></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="编辑SPU"
                @click="updateSpu(scope.row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="checkSku(scope.row)"
              ></el-button>
              <el-popconfirm :title="`你确定删除${scope.row.spuName}?`" width="200px" @confirm="deleteSpu(scope.row)">
                <template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    title="删除SPU"
                    size="small"
                    v-btn="'btn.Spu.delete'"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="sizeChange"
          @current-change="getHasSpu"
        />
      </div>
      <!-- 场景1: 添加/编辑SPU子组件 -->
      <!-- *笔记*绑定事件监听器时，直接指定方法名不需要显示地写形参 -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 场景2: 添加/编辑SKU子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene" />
      <!-- dialog对话框：在SPU中点击查看按钮，展示已有的SKU数据 -->
      <el-dialog v-model="dialogVisible" title="SKU列表" width="500">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="scope">
              <img :src="scope.row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqDeleteSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData, SkuData, SkuInfoData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
// 引入子组件
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
// 引入分类仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

// 场景切换
let scene = ref<number>(0) // 0: 显示已有SPU   1：添加/编辑SPU子组件   2：添加/编辑SKU子组件
// 分页器默认页码
let pageNo = ref<number>(1)
// 每页页码数
let pageSize = ref<number>(3)
// 存储已有SPU数据
let records = ref<Records>([])
// 存储已有SPU总个数（即分页器中total的值
let total = ref<number>(0)
// 获取子组件实例SpuForm
let spu = ref<any>()
// 获取子组件实例SkuForm
let sku = ref<any>()
// 存储所有的SKU数据
let skuArr = ref<SkuData[]>([])
// SKU的dialog的显示与隐藏
let dialogVisible = ref<boolean>(false)

// 监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  }
)
// 获取某一三级分类下已有的全部SPU
const getHasSpu = async (pager = 1) => {
  // 编辑当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 点击分页器下拉菜单改变页码数
const sizeChange = () => {
  getHasSpu()
}
// 点击添加SPU按钮
const addSpu = () => {
  // 切换场景1
  scene.value = 1
  // 调用子组件方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 点击添加SKU按钮
const addSku = (row: SpuData) => {
  // 切换场景2
  scene.value = 2
  sku.value.initAddSku(categoryStore.c1Id, categoryStore.c2Id, row)
}
// 点击编辑SPU按钮
const updateSpu = (row: SpuData) => {
  // 切换场景1
  scene.value = 1
  // 调用子组件实例方法获取完整的已有的SPU数据
  spu.value.initHasSpuData(row)
}
// 点击查看SKU列表按钮
const checkSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    dialogVisible.value = true // 显示dialog
  }
}
// 点击删除SPU按钮
const deleteSpu = async (row: SpuData) => {
  let result = await reqDeleteSpu(row.id as number)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSpu(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
// 子组件SpuForm绑定自定义事件：子组件点击保存/取消 通知父组件切换为场景0。如果是保存，在判断params是add/update决定停留在第一页还是当前页
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params === 'update') {
    //编辑留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}

onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
