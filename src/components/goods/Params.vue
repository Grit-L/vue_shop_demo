<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体区 -->
    <el-card>
      <el-row>
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      </el-row>
      <p>选择商品分类：
        <el-cascader v-model="selectedIdKeys" :options="cateDataList" :props="propsParams"
                     @change="handleChange" :show-all-levels="false">
        </el-cascader>
      </p>
      <!-- 参数列表  -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!--  按钮 -->
          <el-button size="mini" type="primary" :disabled="isbtnDisabled"
                     @click="addDialogVisible = true">添加参数</el-button>
          <!--  列表区 -->
          <el-table :data="paramsDataList" style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!--  按钮 -->
          <el-button size="mini" type="primary" :disabled="isbtnDisabled">添加属性</el-button>
          <!--  列表区 -->
          <el-table :data="paramsDataList" style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- dialog对话框 -->
    <!-- 增加参数dialog -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数dialog -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>export default {
  data () {
    return {
      // 级联框参数
      propsParams: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的商品类别id
      selectedIdKeys: [],
      // 获取商品类别数据
      cateDataList: [],
      // 选中的tab页标识的 默认是动态参数
      activeName: 'many',
      // 参数数据
      paramsDataList: [],
      // 增加dialog可见属性
      addDialogVisible: false,
      //  编辑dialog可见属性
      editDialogVisible: false
    }
  },
  created () {
    this.getCateDataList()
  },
  methods: {
    // 获取商品类别数据
    async getCateDataList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品类别数据失败')
      }
      this.cateDataList = res.data
    },
    // 获取参数列表、
    async getParamsList () {
      // 只有当选中三级标签才发生请求
      if (this.selectedIdKeys.length !== 0) {
        const { data: res } = await this.$http.get(`categories/${this.selectedIdKeys[2]}/attributes`, { params: { sel: this.activeName } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数数据失败')
        }
        this.paramsDataList = res.data
      }
    },
    // 改变级联选择框值
    handleChange () {
      this.getParamsList()
    },
    // 切换tab页
    handleClick (tab) {
      // 切换activeName值
      this.activeName = tab.name
      // 在获取参数列表
      this.getParamsList()
    }
  },
  computed: {
    // 没有获取三级类别 按钮不可用
    isbtnDisabled () {
      if (this.selectedIdKeys.length === 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .p {
    margin: 10px;
  }
</style>
