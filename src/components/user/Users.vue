<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 列表卡片区域 -->
    <el-card>
      <!-- 分栏显示 -->
      <el-row :gutter="40">
        <el-col :span="9">

          <!-- 搜索框功能 模糊搜索 点击情况按钮全局搜索 -->
          <el-input placeholder="请输入内容" v-model="getUserObj.query" clearable @clear="getUserInfo">
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">

          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 数据列表渲染展示 -->
      <el-table :data="userlist" border>
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 获取列表数据 -->
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <!--调试数据-->
            <!--{{scope.row}}-->
            <el-switch v-model="scope.row.mg_state" @change="getChdstatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <!-- 操作字段按钮功能 -->
        <el-table-column label="操作" width="176px">
          <!-- 作用域插槽 未使用就是要默认名 default-->
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserInfo(scope.row.id)"></el-button>
            <!-- 鼠标移到按钮上显示提示文字 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoleDailog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>

      <!--分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getUserObj.pagenum"
        :page-sizes="[5, 10, 20, 30]" :page-size="getUserObj.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="addDialogReset">
      <!-- 添加加用户 -->
      <el-form :model="addForm" :rules="addformRules" ref="ruleFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户dialog页面 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%" @close="editDialogReset">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCommitUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 给用户分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDailogReset">
      <el-form ref="form" :model="ueserInfo" label-width="80px">
        <el-form-item label="当前用户">
          <el-input v-model="ueserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input v-model="ueserInfo.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配角色" >
          <!--  选择框  -->
          <el-select v-model="selectRoleId" placeholder="请选择角色">
          <el-option v-for="item in roleInfoList" :key="item.id"
                     :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>export default {
  data () {
    // 创建邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      // 邮箱正则检验规则
      const regEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱！'))
    }
    // 创建电话教研规则
    var checkPhone = (rule, value, callback) => {
      // 电话正则规则
      const regPhone = /^1[3456789]\d{9}$/
      if (regPhone.test(value)) {
        // 合法电话号码
        return callback()
      }
      callback(new Error('请输入合法电话号码！'))
    }
    return {
      // 创建一个获取用户信息的
      // 查询参数对象
      getUserObj: {
        // 搜索
        query: '',
        // 默认第一页
        pagenum: 1,
        // 默认每页显示的条数
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 关闭dialog属性
      dialogVisible: false,
      // 编辑dialog属性
      editDialogVisible: false,
      // 分配权限dialog
      setRoleDialogVisible: false,
      // 添加的用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑dialog数据
      editForm: {},
      // 添加用户页面-输入框限制规则
      addformRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名称长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }]
      },
      // 编辑用户页面-输入框限制规则
      editFormRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名称长度在 3 到 10 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }]
      },
      // 当前要分配的用户信息
      ueserInfo: {},
      // 选中的角色信息
      selectRoleId: '',
      // 角色信息列表
      roleInfoList: []
    }
  },

  created () {
    this.getUserInfo()
  },

  methods: {
    // 获取用户数据并显示在列表 并保存到data中
    async getUserInfo () {
      const { data: res } = await this.$http.get('users', { params: this.getUserObj })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 编辑状态下的dialog
    async editUserInfo (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户数据失败！')
      }
      this.editForm = res.data
    },
    // 监听一页数据展示数目变化
    handleSizeChange (newsize) {
      // 将数据保存到data
      this.getUserObj.pagesize = newsize
      // 数据展示
      this.getUserInfo()
    },
    // 监听页码改变
    handleCurrentChange (currpage) {
      this.getUserObj.pagenum = currpage
      this.getUserInfo()
    },
    // 监听用户状态的改变
    async getChdstatus (statusInfo) {
      // console.log(statusInfo)
      const { data: res } = await this.$http.put(`users/${statusInfo.id}/state/${statusInfo.mg_state}`)
      if (res.meta.status !== 200) {
        statusInfo = !statusInfo
        return this.$message.error('用户状态修改失败！')
      }
      this.$message.success('用户状态修改成功')
    },
    // 监听对话框关闭动作
    addDialogReset () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 修改对话框重置
    editDialogReset () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加用户 把数据加到数据库
    addUserInfo () {
      // 点击增加按钮预校验
      this.$refs.ruleFormRef.validate(async (valid) => {
        // 填写数据不符合规则 直接返回
        if (!valid) { return false }
        // 填写数据符合规则
        // 增加到数据库
        const { data: res } = await this.$http.post('users', this.addForm)
        // 添加用户失败 提示错误
        if (res.meta.status !== 201) { this.$message.error('添加用户失败') }
        // 添加成功提示语
        this.$message.success('添加用户成功')
        // 关闭dialog页面
        this.dialogVisible = false
        // 刷新列表数据
        this.getUserInfo()
      })
    },
    // 修改用户数据
    editCommitUserInfo () {
      this.$refs.editFormRef.validate(async (valid) => {
        // 填写数据不符合规则 直接返回
        if (!valid) { return false }
        // 填写数据符合规则
        // 增加到数据库
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        // 添加用户失败 提示错误
        // console.log(res)
        if (res.meta.status !== 200) { return this.$message.error('用户信息修改失败') }
        // 添加成功提示语
        this.$message.success('用户信息修改成功')
        // 关闭dialog页面
        this.editDialogVisible = false
        // 刷新列表数据
        this.getUserInfo()
      })
    },
    // 根据ID 删除用户数据
    async delUserInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //  字符串 confirm表示成功删除
      //  字符串 cancle表示取消
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getUserInfo()
    },
    // 点击分配角色按钮
    async setRoleDailog (userInfo) {
      // 获取要分配的用户信息
      this.ueserInfo = userInfo
      // 获取角色信息
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取角色数据失败') }
      // 获取用户的角色信息
      this.roleInfoList = res.data
      this.setRoleDialogVisible = true
    },
    // 确定配置权限
    async chooseRole () {
      // 未选择角色 提示
      if (!this.selectRoleId) { return this.$message.error('请选择角色') }
      const { data: res } = await this.$http.put(`users/${this.ueserInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) { return this.$message.error('配置角色失败') }
      this.$message.success('配置角色成功')
      // 配置成功再重新获取列表数据
      this.getUserInfo()
      // 关闭dialog
      this.setRoleDialogVisible = false
    },
    // 关闭dialog后 重置select框数据
    setRoleDailogReset () {
      this.selectRoleId = ''
      this.ueserInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
