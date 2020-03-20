<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card 主体区域 -->
    <el-card>
      <!--  搜索框-->
      <el-input placeholder="请输入内容" v-model="orderQuery.query" style="width: 30%"
                clearable @clear="getOrderList">
        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
      </el-input>
      <!--  列表区 -->
      <el-table :data="orderList.goods" boder>
        <!--  序列号 -->
        <el-table-column type="index" label="#">
          <template slot-scope="scope">
            <span>{{(orderQuery.pagenum - 1) * orderQuery.pagesize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="90px"></el-table-column>
        <el-table-column label="是否付款" width="90px">
          <template slot-scope="scope">
            <el-tag type="danger" size="small" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" size="small" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="90px">
          <template slot-scope="scope">
            <el-tag size="small" effect="dark" v-if="scope.row.is_send === '是'">已发货</el-tag>
            <el-tag size="small" type="danger" effect="dark" v-else>未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="180px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
            <el-button size="mini" icon="el-icon-location-information" type="success"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="orderQuery.pagenum" :page-sizes="[10, 15, 20, 30]"
                     :page-size="orderQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 订单数据
      orderList: [],
      // 请求参数
      orderQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总订单数
      total: 0
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.orderQuery })
      if (res.meta.status !== 200) { return this.$message.error('获取订单数据失败') }
      console.log(res.data)
      this.orderList = res.data
      this.total = res.data.total
    },
    // 修改一页显示数据量
    handleSizeChange (newSize) {
      this.orderQuery.pagesize = newSize
      this.getOrderList()
    },
    // 修改页面跳转
    handleCurrentChange (newPage) {
      this.orderQuery.pagenum = newPage
      this.getOrderList()
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-bottom: 15px;
}
</style>
