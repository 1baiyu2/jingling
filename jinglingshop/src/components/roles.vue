<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-button type="primary" @click="addRoleButton">添加角色</el-button>

      <!-- 角色信息列表 -->
      <template>
        <el-table border stripe :data="rolesList" style="width: 100%; font-size: 12px; margin-top: 15px;">
          <el-table-column type="expand">
            <template slot-scope="scope">

              <el-row v-for="(item, index) in scope.row.children" :key="item.id"
                :class="['bottom', index === 0 ? 'bdtop' : '']">
                <el-col :span="6">
                  <el-tag closable @close="deleteDag(scope.row.id, item.id)"> {{ item.authName }}</el-tag>
                  <i style="font-size: 14px;" class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span='18'>
                  <el-row :class="['bottom', ind === 0 ? 'bdtop' : '']" v-for="(itChild, ind) in item.children"
                    :key="itChild.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="deleteDag(scope.row.id, itChild.id)">
                        {{
                          itChild.authName
                        }}</el-tag>
                      <i style="font-size: 14px;" class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="(child, indc) in itChild.children" :key="child.id" type="warning" closable
                        @close="deleteDag(scope.row.id, child.id)">
                        {{ child.authName }}
                      </el-tag>
                    </el-col>

                  </el-row>

                </el-col>
              </el-row>

            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称">
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <!-- 编辑删除分配角色权限 -->
            <!-- 编辑角色信息按钮 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editButton(scope.row.id)">
                编辑
              </el-button>
              <!-- 删除角色按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteButton(scope.row.id)">
                删除
              </el-button>
              <!-- 分配角色权限按钮 -->

              <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="assignRightsButton(scope.row)">
                分配权限</el-button>

            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%" @close="resetAddForm">
        <!--添加角色表单  -->
        <el-form :hide-required-asterisk="true" :show-message="false" :model="addRoleFrom" :rules="addRoleFromrules"
          ref="addRoleRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleName">
            <el-input v-model="addRoleFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRoleRequest">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog title="修改角色" :visible.sync="editRoleDialog" width="50%" @close="resetEditForm">
        <el-form :hide-required-asterisk="true" :show-message="false" :model="editRoleForm" :rules="addRoleFromrules"
          ref="editRoleFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRequest">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="assignRightsDialog" width="50%" @close="rightClose">
        <!-- 权限的树形控件 -->
        <el-tree :data="roleRightsList" show-checkbox node-key="id" :default-expanded-keys="expandedKeys"
          ref="rightTreeRef" :default-checked-keys="this.checkedKeys = checkedKeys
            " :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignRightsDialog = false">取 消</el-button>
          <el-button type="primary" @click="rightsRequest">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Login from '@/views/Login.vue';

export default {
  props: {

  },
  data() {
    return {
      // 角色信息列表
      rolesList: [],
      // 添加角色框
      addRoleDialog: false,
      addRoleFrom: {
        roleName: '',
        roleDesc: '',
      },
      addRoleFromrules: {
        roleName: [{ required: true, message: ' ', trigger: 'blur' }],
        roleDesc: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
      },
      // 编辑角色框
      editRoleDialog: false,
      editRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 分配权限
      assignRightsDialog: false,
      // 权限列表
      roleRightsList: [],
      defaultProps: {
        label: 'authName',
        children: 'children',
      },
      // 展开的一级  二级权限
      expandedKeys: [],
      // 选中的三级权限
      checkedKeys: [],
      // 角色id
      roleId: '',


    };
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      let { data: res } = await this.axios.get('roles');
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('请求数据失败')
      this.rolesList = res.data;


    },
    // 删除一级tag标签
    async deleteDag(roleid, rightsid) {
      // 角色id
      // 权限id
      // 标签删除
      let { data: res } = await this.axios.delete(`roles/${roleid}/rights/${rightsid}`);
      if (res.meta.status != 200) return this.$message.error('删除标签失败！');
      this.$message.success('删除成功！');
      this.getRolesList();


    },
    // 添加角色信息
    addRoleButton() {
      this.addRoleDialog = true;
    },
    // 取消添加 重置表单
    resetAddForm() {
      this.$refs.addRoleRef.resetFields()
    },
    // 确认添加  校验 发起请求
    addRoleRequest() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return this.$message.error('添加数据失败！');
        let { data: res } = await this.axios.post('roles', this.addRoleFrom);
        if (res.meta.status != 200) return this.$message.error('添加角色失败！');
        this.$message.success('添加成功！');
        this.getRolesList();
        this.addRoleDialog = false;
      });



    },
    // 修改角色信息
    async editButton(id) {
      this.editRoleDialog = true;
      let { data: res } = await this.axios.get('roles/' + id);
      if (res.meta.status != 200) return this.$message.error('获取数据失败！');
      this.editRoleForm = res.data;
    },
    // 取消修改 重置表单
    resetEditForm() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 确认修改  校验 发起请求
    editRequest() {
      // console.log(this.editRoleForm.roleId);
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加数据失败！');
        let { data: res } = await this.axios.put(`roles/${this.editRoleForm.roleId}`, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc,
        });
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error('修改角色失败！');
        this.$message.success('更新角色成功！');
        this.getRolesList();
        this.editRoleDialog = false;
      });
    },
    // 删除角色
    async deleteButton(id) {
      const confirmr = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => { });
      if (confirmr != 'confirm') {
        this.$message('取消删除！');
      } else {
        let { data: res } = await this.axios.delete('roles/' + id);
        if (res.meta.status != 200) return this.$message.error('删除失败！');
        this.$message.success('删除成功！');
        this.getRolesList();
      }
    },
    // 分配角色权限
    async assignRightsButton(row) {
      // 获取当前的角色id
      this.roleId = row.id;
      // 获取权限数据
      let { data: res } = await this.axios.get('rights/tree');
      this.roleRightsList = res.data;
      // 获取到一级和二级的id
      let id = [];
      res.data.forEach(item => {
        id.push(item.id);
        item.children.forEach(itemChild => {
          id.push(itemChild.id)
        })
      });
      this.expandedKeys = id;
      // 获取到选中的列表的三级列表
      let checkedid = [];
      row.children.forEach(item => {
        item.children.forEach(itemChild => {
          checkedid.push(itemChild.id);
        })
      });
      this.checkedKeys = checkedid;
      this.assignRightsDialog = true;
    },
    // 点击取消  重置树形结构
    rightClose() {
      // 把选中的节点置为空
      this.checkedKeys = []
    },
    // 确认修改选中的节点
    async rightsRequest() {

      // 保存所有全选和半选中的id
      const keys = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedNodes(),
      ];

      // rids权限 ID 列表（字符串）以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）
      let rids = keys.join(',');
      // 发起修改权限的请求
      let { data: res } = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: rids
      });
      if (res.meta.status != 200) return this.$message.error('更新失败！');
      this.$message.success('更新成功！');
      this.getRolesList();
      this.assignRightsDialog=false;
    }
  },
  components: {

  },
};
</script>

<style scoped lang="less">
.el-row {
  width: 90%;
  margin: auto;

  .el-tag {
    margin: 10px;
  }

  .bottom {
    border-bottom: 1px solid #ebeef5;
  }

  .bdtop {
    border-top: 1px solid #ebeef5;
  }
}
</style>
