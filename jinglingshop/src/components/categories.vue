<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 15px;">
      <el-button type="primary" @click="addButton">添加分类</el-button>
      <tree-table style="margin-top: 15px;" ref="table" sum-text="sum" index-text="#" :data="catelist" :columns="columns"
        :expandType="false" :showIndex="true" :selectionType="false" border>
        <!-- 自定义是否有效列 -->
        <template slot="isok" slot-scope="scope">

          <i style="color: rgb(144,238,144);" class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
          <i style="color: rgb(254,240,240);" class="el-icon-error" v-else></i>



        </template>
        <!-- 自定义排序列 -->
        <template slot="islevel" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == '0'">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level == '1'" type="sunccess">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>


        </template>
        <!-- 自定义操作列 -->
        <template slot="isedit" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editButton(scope.row.cat_id)">编辑</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete"
            @click="deleteButton(scope.row.cat_id)">删除</el-button>

        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination style="margin-top: 15px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="cateInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="cateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialog" width="50%" @close="addDialogClose">
        <!-- 添加分类表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">

            <el-cascader v-model="keysvalue" :options="jilianData" :props="jianlianProps
              " @change="handleChange" expand-trigger='hover'></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRequest">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类 -->
      <el-dialog title="编辑分类" :visible.sync="editDialog" width="50%" @close="editDialogClose">
        <!-- 编辑分类表单 -->
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRequest">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      catelist: [],
      // 请求参数
      cateInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',

        },

        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 自定义列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'islevel'
        },
        {
          label: '操作',
          type: 'template',
          template: 'isedit'
        },
      ],
      // 添加分类对话框
      addDialog: false,
      // 编辑分类对话框
      editDialog: false,
      // 添加分类表单
      addForm: {
        // 分类名称
        cat_pid: '',//分类父 ID不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_name: '',//分类名称不能为空
        cat_level: '',//分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        cat_pid: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 编辑分类表单
      editForm: {
        // 一级分类名称
        cat_name: '',
        cat_id: ''
      },
      // 添加分类的级联选择器的数据列表
      jilianData: [],
      jianlianProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      keysvalue: []



    };
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.axios.get('categories', {
        params: this.cateInfo
      });
      console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取分类失败！')
      this.catelist = res.data.result
        ;
      this.total = res.data.total
      // console.log(this.catelist[0].cat_deleted);
    },
    // 分页监听
    handleSizeChange(newSize) {
      this.cateInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.cateInfo.pagenum = newPage;
      this.getCateList();
    },
    // 添加分类
    addButton() {
      this.getParentCate();
      this.addDialog = true;
      // 编辑分类对话框
    },
    // 获取一级二级分类的一些东西  根据type可以获取
    async getParentCate() {
      let { data: res } = await this.axios.get('categories', {
        params: {
          type: 2
        }
      });
      this.jilianData = res.data;
      // console.log(this.jilianData);
    },
    // 关闭分类
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
      this.keysvalue = [];
    },
    // 确定添加分类
    async addRequest() {
      // console.log(this.keysvalue);
      this.$refs.addFormRef.validate(async valid => {

        if (!valid) return this.$message.error('添加分类失败！');

        // 如果this.keysvalue的长度为0  则添加的是一级分类  1  二级分类  2  三级分类
        // cat_pid分类父 ID不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`
        // cat_name分类名称不能为空
        // cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        if (this.keysvalue.length == 0) {
          this.addForm.cat_pid = 0;
          this.addForm.cat_level = 0;
        } else if (this.keysvalue.length == 1) {
          this.addForm.cat_pid = this.keysvalue[0]
          this.addForm.cat_level = 1;
        } else {
          this.addForm.cat_pid = this.keysvalue[1]
          this.addForm.cat_level = 2;
        }
        let { data: res } = await this.axios.post('categories', this.addForm);
        console.log(res);
        if (res.meta.status != 201) return this.$message.error('添加失败')
        this.getCateList();
        this.$message.success('添加分类成功！');
        this.addDialog = false;
      })
    },
    // 修改分类
    async editButton(id) {
      // 获取一级分类
      let { data: res } = await this.axios.get('categories/' + id);
      if (res.meta.status != 200) return this.$message.error('获取分类数据失败！');
      this.editForm.cat_name = res.data.cat_name;
      this.editForm.cat_id = res.data.cat_id;
      this.editDialog = true;
    },
    // 取消编辑  重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 确认修改
    async editRequest() {
      console.log(this.editForm);
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加分类失败！');
        let { data: res } = await this.axios.put('categories/' + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name
        });
        if (res.meta.status != 200) return this.$message.error('更新失败')
        this.getCateList();
        this.$message.success('修改分类成功！');
        this.editDialog = false;

      })
    },
    // 级联选择器发送变化的时候执行
    handleChange() {
      // console.log(this.keysvalue);
    },
    // 删除分类
    async deleteButton(id) {
      let confirmR = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => { });
      if (confirmR != 'confirm') return this.$message('取消删除');
      let { data: res } = await this.axios.delete('categories/' + id);
      if (res.meta.status != 200) return this.$message.error('删除失败');
      this.$message.success('删除成功！');
      this.getCateList();




    }
  },
  components: {

  },
};
</script>

<style scoped lang="less"></style>
