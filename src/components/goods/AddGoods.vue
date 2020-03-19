<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体card 区域-->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>

      <!-- 步骤区域 -->
      <el-steps :space="200" align-center :active="activeIndex - 0" finish-status="success" style="margin: 20px 0;">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左侧tab区域 -->
      <!--外层加form标单-->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px"
               label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="befLeave" @tab-click="tabClickChange">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <!--  强制能输入数字 限制9位 -->
              <el-input v-model="addGoodsForm.goods_price" maxlength="9"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addGoodsForm.goods_cat" :options="cateList"
                           :props="cascaderProps" @change="handleChange" :show-all-levels="false">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 参数名 -->
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <!-- 参数值 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 属性名 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
              <!-- 属性值 -->
              <el-input v-model="item.attr_vals" placeholder=""></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--  action --》上传服务器地址 -->
            <el-upload class="upload-demo" :action="uploadURL" :headers="headerObj"
                       :on-preview="handlePreview" :on-remove="handleRemove"
                       multiple list-type="picture" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="margin: 10px 0; font-size: 14px">只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览"
               :visible.sync="picDialogVisible" width="50%">
      <img :src="picPreviewPath" class="imageWidth">
    </el-dialog>
  </div>
</template>

<script>export default {
  data () {
    return {
      // 点击tab与步骤绑定
      activeIndex: '0',
      addGoodsFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品类别',
            trigger: 'blur'
          }
        ]
      },
      // 增加商品数据
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      // 商品类别数据
      cateList: [],
      // 商品参数页数据
      manyData: [],
      // 商品属性页数据
      onlyData: [],
      // 级联选择框属性
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的请求对象 获取token值
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //  图片地址
      picPreviewPath: '',
      //  预览框
      picDialogVisible: false
    }
  },
  created () {
    this.getCateData()
  },
  methods: {
    // 获取商品类别数据
    async getCateData () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品类别数据失败')
      }
      // console.log(res.data)
      this.cateList = res.data
    },
    handleChange () {
    },
    // 未选择商品类别 tab不能切换
    befLeave (activeName, oldActiveName) {
      // 从第一页 并且没有选择三级分类 不可切换tab
      if (oldActiveName === 0 || this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击切换tab页面
    async tabClickChange () {
      switch (this.activeIndex) {
        case '1': {
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: { sel: 'many' }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品参数失败')
          }
          // 先把字符串转为列表
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          console.log(res.data)
          this.manyData = res.data
          break
        }
        case '2': {
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: { sel: 'only' }
          })
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品参数失败')
          }
          // 先把字符串转为列表
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          console.log(res.data)
          this.onlyData = res.data
          break
        }
        case '3':
          console.log('这是第3页')
          break
        case '4':
          console.log('这是第4页')
          break
      }
    },
    // 上传成功
    handleSuccess (response) {
      this.$message.success('上传成功')
      // console.log(response)
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.addGoodsForm.pics.push(picInfo)
    },
    // 删除图片
    handleRemove (file) {
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用splice方法，移除图片信息
      this.addGoodsForm.splice(i, 1)
    },
    // 图片预览
    handlePreview (file) {
      //  获取详情地址
      this.picPreviewPath = file.response.data.url
      console.log(file.response.data.url)
      //  打开预览框
      this.picDialogVisible = true
    }
  },
  computed: {
    cateId () {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
  .el-checkbox {
    margin: 5px 8px !important;
  }

  .imageWidth {
    width: 100%;
  }
</style>
