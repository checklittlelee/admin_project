<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select style="width: 240px" v-model="item.attrIdAndValueId">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select style="width: 240px" v-model="item.saleIdAndValueId">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${item.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="scope">
            <img :src="scope.row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handler(scope.row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { reqAttr } from '@/api/product/attr'
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
let attrArr = ref<any>([]) // 平台属性
let saleArr = ref<any>([]) // 销售属性
let imgArr = ref<any>([]) // 照片的数据
let table = ref<any>() // 获取table组件实例
let skuParams = reactive<SkuData>({
  // 父组件传递过来的数据
  category3Id: '',
  spuId: '',
  tmId: '',
  // 通过v-model收集的数据
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  // 最后点击保存按钮的时候获取
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [], // 销售属性
  // 点击设置默认图片按钮获取
  skuDefaultImg: ''
})

// 点击设置默认图片按钮
const handler = (row: any) => {
  // 先全部不勾选，再选中该选的
  table.value.clearSelection()
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

// 点击保存按钮
const save = async () => {
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId
      })
    }
    return prev
  }, [])
  // 发送添加SKU的请求
  let result = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '添加SKU成功' })
    $emit('changeScene', { flag: 0, params: 'update' })
  } else {
    ElMessage({ type: 'error', message: '添加SKU失败' })
  }
}
// 点击取消按钮(自定义事件的方法)：通知父组件切换为场景1。父组件回到SPU，无需发请求，所以params为空
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

// 添加一个新SKU的初始化请求方法
const initAddSku = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  // 收集父组件传递过来的数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  let result2: any = await reqSpuImageList(spu.id)
  attrArr.value = result.data // 平台属性
  saleArr.value = result1.data // 销售属性
  imgArr.value = result2.data // 照片墙
}

// 对外暴露
defineExpose({ initAddSku })
</script>

<style scoped></style>
