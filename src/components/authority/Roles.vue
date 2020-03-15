<template>
  <div>
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 列表区-->
    <el-card>
      <!-- 角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="roleAuthorList" border stripe>
        <!-- 各列数据 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级权限 -->
            <el-row  :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <el-col :span="4">
                <el-tag closable @close="rmRightTag(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="20">
                <el-row v-for="(item2,i2) in item1.children"
                        :class="[i2 === 0 ? '': 'bdtop', 'vcenter']" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="rmRightTag(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"  v-for="(item3) in item2.children" :key="item3.id" closable
                            @close="rmRightTag(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <!-- “操作” 列 -->
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="getRoleInfo(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRoleInfo(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="getAuthorityTree(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- dialog区域 -->
      <!-- 增加角色  -->
      <el-dialog title="新增角色信息" :visible.sync="addDialogVisible" width="30%" @close="addDialogReset">
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog title="编辑角色信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogReset">
        <el-form :model="editRoleForm" :rules="editRoleRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog title="分配权限" :visible.sync="authorDialogVisible" width="30%" @close="getAuthorDialogReset">
        <!-- 树形控件 -->
        <el-tree :data="authorityTree" :props="treeProps"
                 show-checkbox default-expand-all node-key="id"
                 :default-checked-keys="refKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="authorDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="authorDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>export default {
  data () {
    return {
      // 增加 字段校验规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 编辑 字段校验规则
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 角色列表数据
      roleAuthorList: [],
      // dialog弹出框是否可见
      addDialogVisible: false,
      // 增加dialog数据
      addRoleForm: {},
      // 编辑dialog数据 :modle接收的 {}
      editRoleForm: {},
      // dialog弹出框是否可见
      editDialogVisible: false,
      // 分配权限对话框是否可见
      authorDialogVisible: false,
      // 权限数据
      authorityTree: {},
      // 定义树 的属性获取
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的权限id值
      refKeys: []
    }
  },

  created () {
    this.getRolesList()
  },

  methods: {

    // 获取列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色数据失败')
      }
      this.roleAuthorList = res.data
    },

    // 增加角色
    addRoles () {
      //  字段规则校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写合法数值')
        }
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        // 成功提示
        this.$message.success('添加角色成功')
        //  关闭dialog
        this.addDialogVisible = false
        //  重新获取列表数据
        this.getRolesList()
      })
    },

    // 监听增加对话框关闭 重置form表单
    addDialogReset () {
      this.$refs.addFormRef.resetFields()
    },

    // 获取角色信息
    async getRoleInfo (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) { return this.message.error('获取角色数据失败') }
      // 获取数据库中的数据
      this.editRoleForm = res.data
    },

    // 提交编辑后的角色信息
    editRoleInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // 填写数据不符合规则 直接返回
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色数据失败')
        }
        // 编辑成功提示
        this.$message.success('角色信息修改成功')
        // 关闭dialog
        this.editDialogVisible = false
        // 列表重新获取数据
        this.getRolesList()
      })
    },

    // 监听编辑对话框关闭
    editDialogReset () {
      this.$refs.editFormRef.resetFields()
    },

    // 删除角色信息
    async delRoleInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).catch(err => err)
      // 点击取消按钮
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除') }
      //  点击确认按钮
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除失败') }
      // 删除成功提示
      this.$message.success('删除角色成功')
      // 关闭dialog
      this.editDialogVisible = false
      // 列表重新获取数据
      this.getRolesList()
    },

    // 删除权限
    async rmRightTag (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        // 取消删除操作
        return this.$message.info('已取消权限删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res.meta.status)
      if (res.meta.status !== 200) { return this.$message.error('权限删除失败') }
      this.$message.success('权限删除成功')
      // 权限赋值 还是在权限详情页
      role.children = res.data
      // 不推荐做法 重新渲染页面
      // this.getRolesList = res.data
    },

    // 点击分配权限按钮 获取角色权限值
    async getAuthorityTree (role) {
      // 页面开启前加载数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('获取权限数据失败') }
      this.authorityTree = res.data
      console.log(this.authorityTree)
      // 获取节点ID
      this.getLeafKeys(role, this.refKeys)
      this.authorDialogVisible = true
    },
    // 递归获取三级权限的id值
    getLeafKeys (node, arr) {
      // 表示三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归直到获取第三级
      node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    // 监听权限对话框
    getAuthorDialogReset () {
      this.refKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
  /*设置tag样式值*/
  .el-tag {
    margin: 7px;
    font-size: 14px;
  }
  /*加上边分割线*/
  .bdtop {
    border-top:  1px solid #eee;
  }
  /*加底边分割线*/
  .bdbottom {
    border-bottom:  1px solid #eee;
  }
  /*标签居中显示*/
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
