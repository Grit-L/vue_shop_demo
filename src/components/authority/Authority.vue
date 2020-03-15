<template>
  <div>
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 列表卡片区域 -->
    <el-card>
      <el-table :data="authorityList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 获取列表数据 -->
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>export default {
  data () {
    return {
      authorityList: []
    }
  },

  created () {
    this.getAuthoritList()
  },
  methods: {
    async getAuthoritList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) { return this.$message.error('获取权限列表失败') }
      this.authorityList = res.data
      // console.log(this.authorityList)
    }
  }
}
</script>

<style scoped>

</style>
