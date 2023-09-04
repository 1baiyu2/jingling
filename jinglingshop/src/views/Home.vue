<template>
  <div class="homebox">
    <el-container>
      <el-header>
        <div class="left">
          <img src="@/assets/jingling_logo.png" alt="">
          <span>精灵购物平台管理系统</span>
        </div>
        <el-button type="info" @click="loginOut">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <div class="togglebutton" @click="zhedie">|||</div>

          <!-- 侧边菜单栏 -->
          <el-menu :router="true" default-active="142" background-color="#303641" text-color="#fff"
            active-text-color="#349eff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false">
            <el-submenu :index="'' + item.id" v-for="(item, i) in menuList " :key="item.id">
              <template slot="title">
                <i :class="iconList[i]"></i>
                <span style="margin-left: 10px;">{{ item.authName }}</span>
              </template>
              <el-menu-item-group v-for="(itemChild, iChild) in item.children" :key="itemChild.id">
                <el-menu-item :index="'1' + itemChild.id" :route="{ path: `/home/${itemChild.path}` }">
                  <i class="el-icon-menu"></i>
                  {{ itemChild.authName }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      menuList: [],
      iconList: ['el-icon-s-goods', 'el-icon-s-help', 'el-icon-s-cooperation', 'el-icon-s-shop', 'el-icon-s-claim',],
      asideWidth: '200px',
      isCollapse: false

    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    // 获取到侧边栏数据
    async getMenuList() {
      let { data: res } = await this.axios.get('menus');
      // console.log(res);
      if (res.meta.status != 200) return this.message.error('加载菜单失败');
      this.menuList = res.data;
    },
    // 点击折叠
    zhedie() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.asideWidth = '64px'

      } else {
        this.asideWidth = '200px';

      }

    },
    // 退出登录  删除token
    loginOut() {
      sessionStorage.removeItem('token');
      this.$router.push('/login').catch(error => { });
    },
  },
  components: {

  },
};
</script>

<style scoped lang="less">
.homebox {
  width: 100%;
  height: 100%;

  .el-container {
    width: 100%;
    height: 100%;

    .el-header {
      background-color: rgb(53, 60, 62);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;
        color: white;
        font-size: 20px;

        img {
          width: 50px;
          height: 50px;
        }
      }

      .el-button {
        width: 70px;
        height: 40px;
      }
    }

    .el-aside {

      background-color: rgb(48, 54, 65);
      color: white;


      .togglebutton {
        width: 100%;
        padding: 5px 0;
        font-size: 14px;
        text-align: center;
        letter-spacing: 1px;
        background-color: #545c64;

      }

      .el-menu {

        border: 0 !important;



      }

    }

    .el-main {
      background: url(../assets/bj.jpg);
      color: white;

      line-height: 20px;

    }

  }


}
</style>

