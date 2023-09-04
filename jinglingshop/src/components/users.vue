<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">

      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="userRequest.query" class="input-with-select" style="width: 460px;">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
          <el-button type="primary" style="margin-left: 20px;" @click="addUsers">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户信息表格数据 -->

      <template>
        <el-table :data="userList" border stripe style="width: 100%; margin-top: 15px; font-size: 12px;">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile" label="电话">
          </el-table-column>
          <el-table-column prop="role_name" label="角色">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="modifiedState(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <!-- 编辑删除分配角色 -->
            <!-- 编辑信息按钮 -->
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editButton(scope.row.id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteButton(scope.row.id)"></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end" :enterable="false">
                <el-button type="warning" icon="el-icon-s-tools" size="mini"
                  @click="assignRoleButton(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页部分 -->
      <el-pagination style="margin-top: 15px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="userRequest.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="userRequest.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUser" width="50%" @close="editClose">
      <!-- 修改信息form表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUser = false">取 消</el-button>
        <el-button type="primary" @click="editRequest">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignRoles" width="50%" @close="assignroleClose">
      当前的用户：{{ username }}
      <br>
      当前的角色：{{ role_name }}
      <br>
      <span style="margin-top: 10px; display: inline-block;">
        分配新角色：
        <el-select v-model="rolevalue" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoles = false">取 消</el-button>
        <el-button type="primary" @click="assignRolesRequest">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="修改用户" :visible.sync="adduser" width="50%" @close="addClose">
      <!--添加角色form表单 -->
      <el-form :model="addForm" :rules="editFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adduser = false">取 消</el-button>
        <el-button type="primary" @click="addRequest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    // 密码校验   6-12位的字母或者数字  ^[a-zA-Z0-9]{6,12}$
    var reg1 = /^[a-zA-Z0-9]{6,12}$/;
    var vpwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (!reg1.test(value)) {
          callback(new Error('请输入6-12位的字母或数字'));
        }
        callback();
      }
    };
    // 手机号校验   11位号码^1[34578]\d{9}$
    var reg = /^1[34578]\d{9}$/;
    var vphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (!reg.test(value)) {
          callback(new Error('手机号格式错误'));
        }
        callback();
      }
    };
    return {
      li: [{
        name: '123'
      }],
      // 接收数据
      userList: [],
      // 请求参数
      userRequest: {
        query: '',//查询参数可以为空
        pagenum: 1,//当前页码不能为空
        pagesize: 2,//
      },
      total: 0,
      editUser: false,
      assignRoles: false,
      // 修改表单的参数
      editForm: {
        username: '',
        mobile: '',
        email: '',
      },
      // 修改表单的验证规则
      editFormRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
        { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        mobile: [{ required: true, validator: vphone, trigger: 'blur' }],
        password: [{ required: true, validator: vpwd, trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      },
      // 分配角色的参数
      username: '',
      role_name: '',
      userID: '',
      // 角色数据列表
      roleList: [],
      rolevalue: '',
      // 添加角色
      adduser: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户表单校验规则
      // 和修改用户的共用一个
      // 分配角色权限  

    };
  },
  mounted() {
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      let { data: res } = await this.axios.get('users', { params: this.userRequest });
      if (res.meta.status != 200) return this.$message.error('获取用户管理列表失败！');
      this.userList = res.data.users;
      this.total = res.data.total;

    },
    // 分页部分
    handleSizeChange(newSize) {
      this.userRequest.pagesize = newSize;
      this.getUsersList();
    },
    handleCurrentChange(newPage) {
      this.userRequest.pagenum = newPage;
      this.getUsersList();
    },
    // 修改状态
    async modifiedState(row) {

      let { data: res } = await this.axios.put(`users/${row.id}/state/${row.mg_state}`);
      if (res.meta.status != 200) return this.$message.error('设置用户状态失败！');
      this.$message.success('设置用户状态成功！');
    },
    // 编辑对话框
    async editButton(id) {
      // 发起查询请求
      let { data: res } = await this.axios.get('users/' + id);
      if (res.meta.status != 200) return this.$message.error('请求用户信息失败！');

      this.editForm = res.data;
      this.editUser = true;

    },
    // 关闭修改对话框  重置表单内容
    editClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 确认修改 校验通过  提交修改
    editRequest() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('内容不合法');
        // console.log(this.editForm.email);
        let { data: res } = await this.axios.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error('修改失败！');
        this.$message.success('修改成功！');
        this.getUsersList();
        this.editUser = false;

      })
    },
    // 删除弹框
    async deleteButton(id) {
      const confirmr = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => { });
      if (confirmr != 'confirm') {
        this.$message('取消删除！');
      } else {
        let { data: res } = await this.axios.delete('users/' + id);
        if (res.meta.status != 200) return this.$message.error('删除失败！');
        this.$message.success('删除成功！');
        this.getUsersList();
      }
    },
    // 分配角色对话框
    assignRoleButton(row) {
      this.username = row.username;
      this.role_name = row.role_name;
      // console.log(row);
      this.userID = row.id
      this.getroleList();


      this.assignRoles = true;
    },
    async assignRolesRequest() {
      // console.log(this.rolevalue);
      if (this.rolevalue == '') return this.$message.error('请选择要分配的角色！');
      let { data: res } = await this.axios.put(`users/${this.userID}/role`, {
        rid: this.rolevalue
      });
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error('分配权限失败！');
      this.$message.success('分配角色权限成功！');
      this.assignRoles = false;
    },
    assignroleClose() {
      // 关闭对话框  重置选择表单
      this.rolevalue = '';
    },
    // 添加用户对话框
    addUsers() {
      this.adduser = true;
    },
    // 取消添加用户 重置表单
    addClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 确认添加用户  校验  提交请求
    addRequest() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加用户失败');
        let { data: res } = await this.axios.post('users', this.addForm);
        if (res.meta.status != 200) return this.$message.error('创建失败！');
        this.$message.success('创建成功！');
        this.getUsersList();
        this.adduser = false;
      })
    },
    // 获取角色名称
    async getroleList() {
      let { data: res } = await this.axios.get('roles');
      if (res.meta.status != 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data;
    }



  },
  components: {

  },
};
</script>

<style scoped lang="less">
.box {
  color: #ff4949;
  color: #13ce66
}
</style>
