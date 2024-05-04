<template>
  <div>
    <el-card>
      <!-- 卡片顶部添加按钮 -->
      <el-button type="primary" size="default" icon="Plus" @click="addBrand">添加品牌</el-button>
      <!-- 表格组件，展示平台数据 -->
      <el-table style="margin: 10px 0" border :data="brandArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #default="scope">
            <img :src="scope.row.logoUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #default="scope">
            <el-button type="primary" size="small" icon="Edit" @click="updateBrand(scope.row)"></el-button>
            <el-popconfirm
              :title="`确认删除${scope.row.tmName}吗？`"
              icon="Delete"
              @confirm="removeBrand(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->,sizes, total"
        :total="total"
        @size-change="sizeChange"
        @current-change="getHasBrand"
      />
    </el-card>
    <!-- 对话框组件：添加/修改已有品牌 -->
    <el-dialog v-model="dialogFormVisible" :title="brandParams.id ? '修改品牌' : '添加品牌'">
      <!-- 表单 -->
      <el-form style="width: 80%" :model="brandParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="brandParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="brandParams.logoUrl" :src="brandParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 按钮 具名操作 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasBrand, reqAddOrUpdateBrand, reqDeleteBrand } from '@/api/product/brand'
import type { Records, BrandResponseData, BrandData } from '@/api/product/brand/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1) // 当前显示在第1页
let pageSize = ref<number>(3) // 每页显示3条目
let total = ref<number>(0) // 品牌数据总数
let brandArr = ref<Records>([]) // 品牌数组
let dialogFormVisible = ref<boolean>(false) // 对话框显示与否
let brandParams = reactive<BrandData>({
  tmName: '',
  logoUrl: ''
})
let formRef = ref() // 获取对话框中的表单

const getHasBrand = async (pager = 1) => {
  pageNo.value = pager
  let result: BrandResponseData = await reqHasBrand(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    brandArr.value = result.data.records
  }
}
onMounted(() => {
  getHasBrand()
})
const sizeChange = () => {
  // pageSize v-model自动更新，无需传参；getHasBrand()调用时，pager没有值，默认为1，回到第一页
  getHasBrand()
}

// 点击添加品牌按钮 添加不需要携带id，且对话框中要显示添加品牌id得清空
const addBrand = () => {
  brandParams.id = 0
  brandParams.tmName = ''
  brandParams.logoUrl = ''
  dialogFormVisible.value = true
  // 清理表单校验结果
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 点击修改品牌按钮 修改需要携带id
const updateBrand = (row: BrandData) => {
  dialogFormVisible.value = true
  Object.assign(brandParams, row)
  // 清理表单校验结果
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 点击对话框中取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
// 点击对话框中确认按钮
const confirm = async () => {
  await formRef.value.validate() // 发送请求前对整个表单进行校验。valite函数返回一个promise，fullfilled后执行后面逻辑

  const result: any = await reqAddOrUpdateBrand(brandParams)
  if (result.code === 200) {
    // 成功
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: brandParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    getHasBrand(brandParams.id ? pageNo.value : 1) // 重新获取品牌数据。如果是修改留在当前页 如果是添加回到第一页
  } else {
    // 失败
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: brandParams.id ? '修改品牌失败' : '添加品牌失败'
    })
  }
}
// 上传图片组件--上传文件之前的钩子，约束文件类型(png/jpg/gif)和大小(4M)
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
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
// 上传图片组件--上传文件成功时的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  brandParams.logoUrl = response.data // 收集上传图片的地址
  formRef.value.clearValidate('logoUrl') // 清理表单校验结果
}

// tmName自定义校验规则
const validatorTmName = (_rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称应该大于等于2位'))
  }
}
// logoUrl自定义校验规则
const validatorLogoUrl = (_rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('图片不能为空'))
  }
}
// 对话框表单校验规则对象
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName
    }
  ],
  logoUrl: [
    {
      required: true,
      validator: validatorLogoUrl
    }
  ]
}
// 点击气泡确认框确认按钮
const removeBrand = async (id: number) => {
  const result = await reqDeleteBrand(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasBrand(brandArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
