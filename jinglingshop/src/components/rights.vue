<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <!-- 权限列表表格 -->
      <template>
        <el-table border stripe :data="rightsList" style="width: 100%;font-size: 12px;">
          <el-table-column prop="authName" label="权限 ">
          </el-table-column>
          <el-table-column prop="path" label="路径">
          </el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level == '0'">一级</el-tag>
              <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>

            </template>

          </el-table-column>
        </el-table>
      </template>
    </el-card>

  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      rightsList: [],
    };
  },
  mounted() { this.getRightsList(); },
  methods: {
    async getRightsList() {
      let { data: res } = await this.axios.get('rights/list');
      if (res.meta.status != 200) return this.$message.error('获取权限失败！');
      this.rightsList = res.data;
    }
  },
  components: {

  },
};
</script>

<style scoped lang="less"></style>
