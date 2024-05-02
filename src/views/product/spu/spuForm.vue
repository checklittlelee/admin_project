<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId" style="width: 240px">
        <el-option v-for="item in AllBrandData" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入描述" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <!-- 对话框组件--图片预览窗口 -->
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        style="width: 240px"
        v-model="selectedAttr"
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '暂无数据可选择'"
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :value="`${item.id}:${item.name}`"
          :label="item.name"
        >
        </el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="!selectedAttr"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #default="scope">
            <el-tag
              v-for="(item, index) in scope.row.spuSaleAttrValueList"
              :key="item.id"
              style="margin: 0px 5px"
              closable
              @close="scope.row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              :ref="(vc: any) => (inputArr[scope.$index] = vc)"
              v-if="scope.row.flag"
              v-model="scope.row.saleAttrValue"
              @blur="toLook(scope.row)"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              v-else
              @click="toEdit(scope.row, scope.$index)"
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="scope">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice(scope.$index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default" @click="save"
        >保存</el-button
      >
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { reqAllBrand, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import type {
  SaleAttrValue,
  BrandData,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SpuData,
  AllBrand,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
// 存储当前已有的SPU数据的容器
let AllBrandData = ref<BrandData[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([]) // 已选择的销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]) // 所有的销售属性
let SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: []
})

// 收集当下选中的销售属性ID和属性值
let selectedAttr = ref<string>('')

let inputArr = ref<any>([])

// 子组件定义一个方法，父组件点击修改SPU按钮
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  let result: AllBrand = await reqAllBrand()
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储
  AllBrandData.value = result.data
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  saleAttr.value = result2.data
  allSaleAttr.value = result3.data // 全部销售属性
}

// 点击照片墙预览按钮
// *笔记*on-preview 是点击放大镜图标时触发的钩子；on-remove 是点击垃圾桶图标时触发的钩子
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 点击照片墙移除按钮
// *笔记*el-upload组件已经处理好基本删除逻辑，当设置好v-model:file-list="imgList"，组件内部自动同步imgList变化，包括添加和删除。handleRemove一般用于1.需要服务器上也删除这一项；2.显示提示信息或者确认操作；执行额外的状态更新或日志记录
const handleRemove = () => {}
// 图片上传成功之前的钩子--约束文件大小与类型
const handlerUpload = (file: any) => {
  if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') {
    if (file.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上次文件大小应该小于4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上次文件格式务必是png/jpg/gif'
    })
    return false
  }
}

// 计算出未被选中（使用）的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name !== item1.saleAttrName
    })
  })
  return unSelectArr
})
// 点击添加属性按钮
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = selectedAttr.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  selectedAttr.value = ''
}
// 点击添加属性值Plus按钮
const toEdit = (row: SaleAttr, $index: number) => {
  row.flag = true
  row.saleAttrValue = ''
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 表单元素失去焦点
const toLook = (row: SaleAttr) => {
  // 整理成服务器需要的属性值形式
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string
  }
  // 非法情况判断一
  if (saleAttrValue?.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  // 非法情况判断二
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    return
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 点击保存按钮
const save = async () => {
  // 1.照片墙数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 图片的名字
      imgUrl: (item.response && item.response.data) || item.url // *笔记*逻辑与，如果都是真值，返回最后一个
    }
  })
  // 2.销售属性数据 saleAttr整个table的值
  SpuParams.value.spuSaleAttrList = saleAttr.value
  // 3.发请求
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add'
    })
  }
}

// 点击取消按钮(自定义事件的方法)：通知父组件切换为场景1。父组件停留在当前页，所以params为update
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

// 添加一个新SPU的初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
  })
  imgList.value = []
  saleAttr.value = []
  selectedAttr.value = ''
  // 存储三级分类ID
  SpuParams.value.category3Id = c3Id
  // 获取可以设置的所有已有品牌和所有已有属性，该SPU下图片列表和已有的属性不需要请求，因为是添加一个新的
  let result: AllBrand = await reqAllBrand()
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储数据
  AllBrandData.value = result.data
  allSaleAttr.value = result1.data
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
