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
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
              <el-button size="mini" icon="el-icon-edit" type="primary" @click="editAddressDialog"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看物流" placement="top">
              <el-button size="mini" icon="el-icon-location-information" type="success" @click="showProgressDialog"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="orderQuery.pagenum" :page-sizes="[10, 15, 20, 30]"
                     :page-size="orderQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="30%"
      @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef"
        label-width="100px">
        <!--  级联选择框 -->
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!--  按钮  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo"
           :key="index" :timestamp="activity.time" :color="activity.color">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
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
      total: 0,
      // 编辑对话框是否可见
      addressDialogVisible: false,
      // 编辑款信息
      addressForm: {
        address1: [],
        address2: ''
      },
      // 表单规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 物流进度对话框
      progressDialogVisible: false,
      // 物流进度
      progressInfo: []
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
    },
    // 编辑页
    editAddressDialog () {
      this.addressDialogVisible = true
    },
    // 关闭编辑框
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 查看物流
    async showProgressDialog () {
      // 供测试的物流单号：1106975712662
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }
      res.data.forEach(item => {
        // 给对象颜色增加属性
        this.$set(item, 'color', '#0bbd87')
        // console.log(item)
      })
      // console.log(res.data)
      this.progressInfo = res.data
      this.progressDialogVisible = true
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-bottom: 15px;
}
  .el-cascader {
    width: 100%;
  }
</style>
