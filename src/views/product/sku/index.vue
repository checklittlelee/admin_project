<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="50px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="200px" prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="200px">
        <template #default="scope">
          <img :src="scope.row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" width="100px" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" width="100px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="default"
            :icon="scope.row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(scope.row)"
          ></el-button>
          <el-button type="primary" size="default" icon="Edit" @click="editSku"></el-button>
          <el-button type="primary" size="default" icon="InfoFilled" @click="checkSku(scope.row)"></el-button>
          <el-popconfirm
            :title="`你确定要删除${scope.row.skuName}吗？`"
            width="200px"
            @confirm="deleteSku(scope.row.id)"
          >
            <template #reference>
              <el-button type="primary" size="default" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getHasSku"
    />
    <!-- 抽屉组件--展示SKU商品详情 -->
    <el-drawer v-model="drawer" title="查看商品详情">
      <template #default>
        <el-row style="margin: 15px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 15px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 15px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 15px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin: 0px 3px">{{
              item.valueName
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id" style="margin: 0px 3px">{{
              item.saleAttrValueName
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 15px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px" indicator-position="outside">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqOnSaleSku, reqCancelSaleSku, reqSkuInfo, reqDeleteSku } from '@/api/product/sku'
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref<boolean>(false)
let skuInfo = ref<SkuData>({})

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
onMounted(() => {
  getHasSku()
})
const sizeChange = () => {
  getHasSku()
}
// 点击商品上架/下架
const updateSale = async (row: SkuData) => {
  // 如果当前商品的isSale == 1，说明当前是上架，更新为下架
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSaleSku(row.id as number)
    ElMessage({ type: 'success', message: '下架成功' })
    getHasSku(pageNo.value)
  } else {
    // 上架操作
    await reqOnSaleSku(row.id as number)
    ElMessage({ type: 'success', message: '上架成功' })
    getHasSku(pageNo.value)
  }
}
// 点击编辑已有的SKU(无业务)
const editSku = () => {
  ElMessage({
    type: 'success',
    message: '程序员正在开发中，敬请期待'
  })
}
// 点击查看SKU商品详情，呼出一个临时右侧边栏
const checkSku = async (row: SkuData) => {
  drawer.value = true
  // 发请求获取数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code === 200) {
    skuInfo.value = result.data
  }
}
// 点击删除
const deleteSku = async (id: number) => {
  let result: any = await reqDeleteSku(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
