<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <el-row>
        <tree-table class=ttble :data="cateInfoLis" :columns="columns" :selection-type="false"
                    :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!-- 自定义列模版 -->
          <template slot="isOk" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
            style="color: green;"></i>
            <i class="el-icon-circle-close" v-else style="color: red;"></i>
          </template>
          <!--  等级排序  -->
          <template slot="levelSort" slot-scope="scope">
            <el-tag v-if="scope.row.cat_pid === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_pid === 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
          <!--  操作  -->
          <template slot="opt" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
                       @click="editCategoryDialog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"
                       @click="delCategory(scope.row)">删除</el-button>
          </template>
        </tree-table>
      </el-row>

      <!--  编辑商品类别对话框 -->
      <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editConfirmCate">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
    <!--  分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryParams.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>export default {
  data () {
    return {
      // 获取商品类别 请求参数
      queryParams: {
        type: [3],
        pagesize: 5,
        pagenum: 1
      },
      // 数据总条数
      total: 0,
      // 商品列表数据
      cateInfoLis: [],
      // 编辑对话框属性
      editDialogVisible: false,
      // 编辑后的类别名称
      editCateForm: {},
      // 获取商品类别id
      cateId: '',
      editCateFormRules: {
        cat_name: [{ required: true, message: '请输入商品类别名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }]
      },
      // table-tree 列表数据
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        prop: 'cat_deleted',
        type: 'template',
        template: 'isOk'
      },
      {
        label: '排序',
        prop: 'cat_pid',
        type: 'template',
        template: 'levelSort'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }]
    }
  },
  created () {
    this.getCateListInfo()
  },
  methods: {
    // 获取商品分类列表数据
    async getCateListInfo () {
      const { data: res } = await this.$http.get('categories', { params: this.queryParams })
      // console.log(res.data)
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类数据失败') }
      this.cateInfoLis = res.data.result
      this.total = res.data.total
    },
    // 编辑商品类别
    editCategoryDialog (newCateName) {
      // 获取原始类别名称
      this.editCateForm = newCateName
      // 获取商品id
      this.cateId = newCateName.cat_id
      this.editDialogVisible = true
    },
    // 提交修改商品类别
    editConfirmCate () {
      this.$refs.editCateFormRef.validate(async (valid) => {
        // 如果输入字段不合法 直接提示
        if (!valid) { return this.$message.error('请输入合法名称') }
        const { data: res } = await this.$http.put('categories/' + this.cateId,
          { cat_name: this.editCateForm.cat_name })
        console.log(res.meta.status)
        if (res.meta.status !== 200) { return this.$message.error('类别名称修改失败') }
        // 成功则提示成功
        this.$message.success('类别名称修改成功')
        // 重新获取列表数据
        this.getCateinfo()
        // 关闭弹窗
        this.editDialogVisible = false
      })
    },
    //  监听一页展示数据条数变化
    handleSizeChange (newSize) {
      this.queryParams.pagesize = newSize
      // 重新获取页面数据
      this.getCateListInfo()
    },
    // 监听页面跳转
    handleCurrentChange (newPage) {
      this.queryParams.pagenum = newPage
      this.getCateListInfo()
    },
    // 删除商品类别
    async delCategory (cate) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 若点击取消 提示“已取消”
      if (confirmResult !== 'confirm') { return this.$message.info('已取消') }
      // 若提交就发送 delete请求
      const { data: res } = await this.$http.delete('categories/' + cate.cat_id)
      console.log(res.meta.status)
      if (res.meta.status !== 200) { return this.$message.error('删除商品类别失败') }
      this.$message.success('删除商品类别成功')
      // 重新获取列表页
      this.getCateListInfo()
    }
  }
}
</script>

<style scoped>
/*tree-table 与按钮的距离*/
.ttble{
  margin-top: 15px;
}
</style>
