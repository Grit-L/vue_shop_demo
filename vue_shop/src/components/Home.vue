<template>
  <el-container class="homeContainer">
    <!--  头部  -->
    <el-header>
      <div>
        <img class="brand" src="../assets/gaga.jpg" alt="">
        <span>电商管理平台</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>

    <el-container>
      <!--  左侧菜单  -->
      <!-- 根据是否缩放来展示大小 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="collapsed" @click="chdCollapse">{{zoomIcon}}</div>
        <el-menu background-color="#333744" text-color="#fff"
                 active-text-color="#409eff" unique-opened
                 :collapse-transition="false" :collapse=iscollapse router :default-active="activePath" >
          <!--  一级菜单  -->
          <!--   动态接收数值‘:’数值转字符串+“”  -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!--  图标  -->
              <i :class="menuObject[item.id]"></i>
              <!--   文本内容  -->
              <span>{{item.authName}}</span>
            </template>
            <!--  二级菜单  -->
            <el-menu-item :index="'/'+ subItem.path" v-for="subItem in item.children"
                          :key="subItem.id" @click="activeMenu('/'+ subItem.path)">
              <template slot="title">
                <!--  图标  -->
                <i class="el-icon-menu"></i>
                <!--   文本内容  -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--  内容区  -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>export default {
  data () {
    return {
      menulist: [],
      menuObject: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 侧边菜单是否折叠
      iscollapse: false,
      // 侧边菜单的值
      zoomIcon: '<<<',
      // 二级菜单选中的地址值
      activePath: ''
    }
  },
  // 定义一个生命周期函数
  created () {
    this.getMenuItem()
    this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    logOut () {
      // 清空session
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
      this.$message.success('你已退出登录。')
    },
    // 获取所有菜单
    async getMenuItem () {
      // 发起请求,获取数据
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    chdCollapse () {
      this.iscollapse = !this.iscollapse
      this.zoomIcon = this.iscollapse ? '>>>' : '<<<'
    },
    // 保存二级菜单的点击状态
    activeMenu (activePath) {
      window.sessionStorage.setItem('active', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .homeContainer {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 24px;

    > div {
      display: flex;
      align-items: center;

      > span {
        padding: 15px;
      }

      > img {
        height: 60px;
        border-radius: 50%;
      }
    }
  }

  .el-aside {
    background: rgb(51, 55, 68);
    /*修改二级菜单突出*/
    .el-menu {
      border-right: none;
    }

    /*设置展开折叠按钮的样式*/
    .collapsed {
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 1px;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  /*设置一级图标与文本的距离*/
  .iconfont {
    margin-right: 10px;
  }

</style>
