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
          <el-input placeholder="请输入内容" v-model="goodsQuery.query"  clearable @clear="getGoodDatasList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodDatasList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe style="font-size: 14px">
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
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page= "goodsQuery.pagenum" :page-sizes="[10, 30, 50, 100]"
      :page-size="goodsQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 增加商品dialog区域 -->
    <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
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
      // 增加dialog是否可见
      addDialogVisible: false
    }
  },
  created () {
    this.getGoodDatasList()
  },
  methods: {
    // 获取商品列表页数据
    async getGoodDatasList () {
      const { data: res } = await this.$http.get('goods', { params: this.goodsQuery })
      if (res.meta.status !== 200) { return this.$message.error('获取商品数据失败') }
      console.log(res.data)
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
      console.log(res.meta.status)
      if (res.meta.status !== 200) { return this.$message.error('删除商品失败') }
      // 请求成功 提示成功
      this.$message.success('删除商品成功')
      // 重新获取列表数据
      this.getGoodDatasList()
    }
  }
}
</script>

<style scoped>

</style>
