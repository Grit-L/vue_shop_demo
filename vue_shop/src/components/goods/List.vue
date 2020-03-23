<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 点击搜索\情况按钮 搜索-->
          <el-input placeholder="请输入内容" v-model="goodsQuery.query" clearable @clear="getGoodDatasList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodDatasList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe style="font-size: 14px">
        <!--  序列号 -->
        <el-table-column type="index" label="#">
          <template slot-scope="scope">
            <span>{{(goodsQuery.pagenum - 1) * goodsQuery.pagesize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="105px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170">
          <!-- 作用域插槽 利用管道使用全局函数 -->
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="editGoods(scope.row.goods_id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="goodsQuery.pagenum" :page-sizes="[10, 30, 50, 100]"
                   :page-size="goodsQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 编辑商品dialog区域 -->
    <el-dialog title="编辑商品信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editGoodsForm" :rules="editGoodsFormRules" ref="editGoodsFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <!--   商品参数 已优化-无法显示参数类别-->
        <el-form-item label="商品参数">
          <el-form-item :label="item.attr_name+' :'" v-for="item in editGoodsForm.attrs" :key="item.attr_id"
                        label-width="200px">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>
        <!--  已优化 图片删除和编辑图片显示问题 -->
        <el-form-item label="商品图片" prop="pics">
          <el-upload :action="uploadURL" :headers="headerObj" :on-preview="handlePreview"
                     :on-remove="handleRemove" :file-list="fileList"
                     multiple list-type="picture" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" style="margin: 10px 0; font-size: 14px">只能上传jpg/png文件，且不超过500kb</div>
            <!--            <img :src="path" v-for="(path,i) in pics" :key="i">-->
          </el-upload>
        </el-form-item>
        <!--  已完成 -->
        <el-form-item label="商品介绍" prop="goods_introduce">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="editGoodsForm.goods_introduce"></quill-editor>
        </el-form-item>
      </el-form>
      <!-- 确定\取消 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirmGoods">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览dialog -->
    <el-dialog title="图片预览" :visible.sync="editPicDialogVisible" width="50%">
      <img :src="picPreviewPath" class="picStyle">
    </el-dialog>
  </div>
</template>

<script>export default {
  data () {
    return {
      goodsQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 获取商品列表数据
      goodsList: [],
      //  列表总条数
      total: 0,
      // 商品id
      goodsId: '',
      // 编辑dialog是否可见
      editDialogVisible: false,
      // 编辑的商品数据
      editGoodsForm: {},
      // 商品编辑校验
      editGoodsFormRules: {
        goods_name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }],
        goods_state: [{
          required: true
        }]
      },
      // 图片预览框是否可见
      editPicDialogVisible: false,
      // 图片上传服务器地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 设置上传图片header
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的路径
      picPreviewPath: '',
      // 图片的相对路径
      temPath: '',
      fileList: []
    }
  },
  created () {
    this.getGoodDatasList()
  },
  methods: {
    // 获取商品列表页数据
    async getGoodDatasList () {
      const { data: res } = await this.$http.get('goods', { params: this.goodsQuery })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      // console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
      // console.log(res.data)
    },
    // 切换页面
    handleSizeChange (newSize) {
      this.goodsQuery.pagesize = newSize
      this.getGoodDatasList()
    },
    // 切换页面展示条数
    handleCurrentChange (newPage) {
      this.goodsQuery.pagenum = newPage
      this.getGoodDatasList()
    },
    // 点击增加商品按钮 跳转到添加商品页面
    addGoods () {
      this.$router.push('goods/add')
    },
    // 获取商品信息
    async editGoods (id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      // 获取商品动态参数和属性 把参数分割转成列表
      // JSON.parse(JSON.stringify(obj))我们一般用来深拷贝，其过程说白了
      // 就是利用JSON.stringify 将js对象序列化（JSON字符串），再使用JSON.parse来反序列化(还原)js对象
      res.data.attrs = JSON.parse(JSON.stringify(res.data.attrs))
      res.data.attrs.forEach(item => {
        item.attr_vals = item.attr_vals.split(',')
      })
      // 获取图片的url 利用file-list参数展示
      // 当列表为空时 push地址 不然点击编辑按钮每次都会增加图片
      if (this.fileList.length === 0) {
        res.data.pics.forEach(item => {
          const picInfomation = { name: item.pics_id, url: item.pics_mid_url }
          this.fileList.push(picInfomation)
        })
      }
      // console.log(this.fileList.length)
      this.editDialogVisible = true
      this.editGoodsForm = res.data
      // console.log(this.editGoodsForm.goods_id)
      console.log(this.editGoodsForm.pics)
    },
    // 编辑提交商品信息
    editConfirmGoods () {
      // 预校验
      this.$refs.editGoodsFormRef.validate(async (valid) => {
        if (!valid) { return this.$message.error('请填写必选项') }
        // 发起请求
        const { data: res } = await this.$http.put('goods/' + this.editGoodsForm.goods_id, this.editGoodsForm)
        // 判断是否发送成功
        // console.log(res.meta.status)
        if (res.meta.status !== 200) { return this.$message.error('编辑商品失败') }
        this.$message.success('编辑商品成功')
        // 重新获取列表数据
        this.getGoodDatasList()
        // 关闭编辑dialog
        this.editDialogVisible = false
      })
    },
    // 关闭编辑页面，重置数据
    editDialogClosed () {
      this.$refs.editGoodsFormRef.resetFields()
      // 重置图片列表
      this.fileList = []
    },
    // 图片上传成功
    handleSuccess (response) {
      this.$message.success('图片上传成功')
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中 存到editGoodsForm中
      this.editGoodsForm.pics.push(picInfo)
      console.log(this.editGoodsForm.pics)
      console.log(this.editGoodsForm)
    },
    // 图片预览
    handlePreview (file) {
      // console.log(file.url)
      // 获取图片的路径
      this.picPreviewPath = file.url
      // 打开预览框
      this.editPicDialogVisible = true
    },
    // 删除图片
    handleRemove (file, fileList) {
      console.log(file.url)
      console.log('这是list' + fileList)
      // 1.获取将要删除图片的路径
      const filePath = file.url
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.editGoodsForm.pics.findIndex(x => x.pics_mid_url === filePath)
      console.log(i)
      // 3.调用splice方法，移除图片信息
      this.editGoodsForm.pics.splice(i, 1)
    },
    // 删除商品
    async delGoods (row) {
      // 判断是不是点击确定
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      // 点击确定发起请求
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      // 是否请求成功
      // console.log(res.meta.status)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      // 请求成功 提示成功
      this.$message.success('删除商品成功')
      // 重新获取列表数据
      this.getGoodDatasList()
    }
  }
}
</script>

<style scoped>
  .el-checkbox {
    margin: 0 5px !important;
  }

  .picStyle {
    width: 100%;
  }
</style>
