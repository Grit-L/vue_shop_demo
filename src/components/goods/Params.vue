<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
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
          <el-button size="mini" type="primary" :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加参数</el-button>
          <!--  列表区 -->
          <el-table :data="paramsDataList" style="width: 100%">
            <!-- 拓展按钮 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--   参数tag标签  -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"
                        closable @close="handleClose(i,scope.row)" >{{item}}</el-tag>
                <!--  输入框 -->
                <el-input  v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)" style="width: 120px">
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--  序列号 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加按钮-->
          <el-button size="mini" type="primary" :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加属性</el-button>
          <!-- 列表区 -->
          <el-table :data="paramsDataList" style="width: 100%">
            <!--  拓展按钮  -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--   参数tag标签  -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"
                        closable >{{item}}</el-tag>
                <!--  输入框 -->
                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm" style="width: 120px">
                </el-input>
              </template>
            </el-table-column>
            <!--  序列号 -->
            <el-table-column type="index" label="#">
              <template slot-scope="scope">
                <span>{{(goodsQuery.pagenum - 1) * goodsQuery.pagesize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- dialog对话框 -->
    <!-- 增加参数dialog -->
    <el-dialog :title="'添加'+getTitleText" :visible.sync="addDialogVisible" width="30%" @close="addDialogReset">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数dialog -->
    <el-dialog :title="'修改'+getTitleText" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirmParams">确 定</el-button>
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
      // 获取列表参数数据
      paramsDataList: [],
      // 增加dialog可见属性
      addDialogVisible: false,
      //  编辑dialog可见属性
      editDialogVisible: false,
      // 添加数据绑定
      addForm: {
        attr_name: ''
      },
      // 编辑框数据
      editForm: {},
      // 增加dialog 参数规则校验
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数值', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ]
      },
      // 编辑dialog 参数规则校验
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数值', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ]
      }
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
        const { data: res } = await this.$http.get(`categories/${this.cate_id}/attributes`, { params: { sel: this.activeName } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数数据失败')
        }
        // 把获取的 attr_value列表化!!!!
        res.data.forEach(item => {
          //  通过三元表达式判断attr_vals是否为空 并把字符串转为列表
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框的输入值
          item.inputValue = ''
        })
        // console.log(res.data)
        this.paramsDataList = res.data
      }
    },
    // 改变级联选择框值
    handleChange () {
      this.getParamsList()
    },
    // 切换tab页获取数据
    handleClick () {
      this.getParamsList()
    },
    // 增加参数
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        // 输入值预校验
        if (!valid) { return this.$message.error('请输入有效参数') }
        // 输入合法 发送请求
        const { data: res } = await this.$http.post(`categories/${this.cate_id}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        console.log(res.meta.status)
        if (res.meta.status !== 201) { return this.$message.error('增加参数失败') }
        this.$message.success('增加参数成功')
        // 重新获取数据
        this.getParamsList()
        // 关闭dialog
        this.addDialogVisible = false
      })
    },
    // 关闭弹窗重置
    addDialogReset () {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑参数
    async editParams (id) {
      const { data: res } = await this.$http.get(`categories/${this.cate_id}/attributes/${id}`,
        { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('获取数据失败') }
      this.editForm = res.data
      // 打开编辑dialog
      this.editDialogVisible = true
    },
    // 提交编辑编辑
    editConfirmParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) { return this.$message.error('请输入合法参数名') }
        const { data: res } = await this.$http.put(`categories/${this.cate_id}/attributes/${this.editForm.attr_id}`, {
          attr_sel: this.activeName,
          attr_name: this.editForm.attr_name
        })
        if (res.meta.status !== 200) { return this.$message.error('修改参数失败') }
        this.$message.success('修改参数成功')
        // 重新获取数据
        this.getParamsList()
        // 关闭弹窗
        this.editDialogVisible = false
      })
    },
    // 点击tag标签显示输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点 或按下键盘
    handleInputConfirm (row) {
      // 如果输入值为空格 则去除空格 并隐藏
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return 0
      }
      //  输入合法值 保存
      row.attr_vals.push(row.inputValue)
      // 重置输入框内容
      row.inputValue = ''
      // 隐藏输入框
      row.inputVisible = false
      // 保存到数据库中
      this.saveAttribute(row)
    },
    // 删除标签
    handleClose (i, row) {
      // 去除标签
      row.attr_vals.splice(i, 1)
      // 保存到数据库
      this.saveAttribute(row)
    },
    async saveAttribute (row) {
      const { data: res } = await this.$http.put(`categories/${this.cate_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 保存的是字符串，而row.attr_vals是列表
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) { return this.$message.error('修改参数项成功！') }
      this.$message.success('修改参数项成功！')
    },
    // 删除列表参数
    async delParams (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击取消删除
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消') }
      // 发送删除请求
      // console.log(cate_id)
      const { data: res } = await this.$http.delete(`categories/${this.cate_id}/attributes/${id}`)
      console.log(res.meta.status)
      if (res.meta.status !== 200) { return this.$message.error('删除参数失败') }
      this.$message.success('删除参数成功')
      // 重新获取数据
      this.getParamsList()
    }
  },
  computed: {
    // 没有获取三级类别 按钮不可用
    isBtnDisabled () {
      if (this.selectedIdKeys.length === 0) {
        return true
      } else {
        return false
      }
    },
    // dialog弹窗名字
    getTitleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
    // 选中三级类别id
    cate_id () {
      return this.selectedIdKeys[2]
    }
  }
}
</script>

<style lang="less" scoped>
  .p {
    margin: 10px;
  }
  .el-tag {
    margin: 5px;
  }

</style>
