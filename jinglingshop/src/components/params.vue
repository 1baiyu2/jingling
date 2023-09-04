<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <el-alert title="
注意！只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>
      <el-row style="margin-top: 15px;">
        <el-col>
          选择商品分类：
          <!-- 级联选择器 -->
          <el-cascader v-model="clickKeys" :options="cateList" :props="cateProps" @change="handleChange"
            expandTrigger='hover'></el-cascader>
        </el-col>
      </el-row>
      <!--动态参数  静态属性 -->
      <template style="margin-top: 15px;">
        <el-tabs v-model="activeName" @tab-click="paranshandleClick">
          <el-tab-pane label="动态参数" name="first">
            <el-button size="mini" type="primary" :disabled="isButtonDIS" @click=addParamsButton>添加参数</el-button>
            <!-- 动态参数表格 -->
            <template>
              <el-table border stripe :data="dongtaiParam" style="width: 100%;margin-top: 15px; font-size: 12px;">
                <el-table-column type='expand'>
                  <template slot-scope="scope">
                    <el-tag style="margin-left: 10px;" closable v-for="(item, index) in scope.row.attr_vals"
                      :keys="'id' + index" @close="tagClose(scope.row, index)">
                      {{ item }}
                    </el-tag>
                    <el-input style="width: 100px; margin-left: 15px;" class="input-new-tag" v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"
                      :autofocus="true">
                    </el-input>
                    <el-button style="margin-left: 15px;" v-else class="button-new-tag" size="small"
                      @click="showInput(scope.row)">+
                      New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type='index'>
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"
                      @click="editParamsButton(scope.row.attr_id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                      @click="deleteParamsButton(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="second">
            <el-button size="mini" type="primary" :disabled="isButtonDIS" @click="addAttrButton">静态属性</el-button>
            <!-- 静态属性表格 -->
            <template>
              <el-table border stripe :data="jingtaiAttribute" style="width: 100%;margin-top: 15px; font-size: 12px;">
                <el-table-column type='expand'>
                  <template slot-scope="scope">
                    <el-tag style="margin-left: 10px;" closable v-for="(item, index) in scope.row.attr_vals"
                      :keys="'id' + index" @close="tagClose(scope.row, index)">
                      {{ item }}
                    </el-tag>
                    <el-input style="width: 100px; margin-left: 15px;" class="input-new-tag" v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"
                      :autofocus="true">
                    </el-input>
                    <el-button style="margin-left: 15px;" v-else class="button-new-tag" size="small"
                      @click="showInput(scope.row)">+
                      New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type='index'>
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"
                      @click="editParamsButton(scope.row.attr_id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                      @click="deleteParamsButton(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>

        </el-tabs>
      </template>

    </el-card>
    <!-- 共用对话框 -->
    <!-- 1.add动态参数对话框 -->
    <!-- 2.add静态属性对话框 -->
    <el-dialog :title="'添加' + tittleText" :visible.sync="addDialog" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRuels" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="tittleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRequest">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 3.edit动态参数对话框  -->
    <!-- 4.edit静态属性对话框 -->
    <el-dialog :title="'编辑' + tittleText" :visible.sync="editDialog" width="50%" @close="editDialogClose">
      <el-form :model="editFrom" :rules="editFormRuels" ref="editFromRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="tittleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRequest">确 定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      clickKeys: [],

      activeName: 'first',
      // 动态参数
      dongtaiParam: [],
      // 静态属性
      jingtaiAttribute: [],
      addDialog: false,
      editDialog: false,
      addForm: {
        attr_name: '',

      },
      addFormRuels: {
        attr_name: [
          { required: true, message: `请输入参数名称`, trigger: 'blur' }
        ]
      },

      // 编辑表单
      editFrom: {
        attr_name: '',
      },
      editFormRuels: {
        attr_name: [
          { required: true, message: `请输入参数名称`, trigger: 'blur' }
        ]
      },
      //input   button  转换 
      inputVisible: false,
      inputValue: ''//接收出入进来的tag标签
    };
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.axios.get('categories');
      if (res.meta.status != 200) return this.$message.error('获取分类列表失败！');
      this.cateList = res.data;


    },


    // 级联选择器被选中的时候触发该函数
    async handleChange() {
      if (this.clickKeys.length != 3) return
      // 获取动态参数获取静态属性
      // this.dongtaiParam = await this.getParams(this.isCateId, 'many');
      // this.jingtaiAttribute = await this.getParams(this.isCateId, 'only');

      let { data: res } = await this.axios.get(`categories/${this.isCateId}/attributes`, {
        params: {
          sel: 'many'
        }
      });

      if (res.meta.status != 200) return this.$message.error('获取参数失败！');
      // 对attr_val进行处理
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split('，');
        item.inputVisible = this.inputVisible;
        item.inputValue = this.inputValue;
      });

      this.dongtaiParam = res.data;




      let { data: res1 } = await this.axios.get(`categories/${this.isCateId}/attributes`, {
        params: {
          sel: 'only'
        }
      });

      // 对attr_val进行处理
      res1.data.forEach(item => {
        item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split('，');
        item.inputVisible = this.inputVisible;
        item.inputValue = this.inputValue;
      });
      if (res1.meta.status != 200) return this.$message.error('获取参数失败！');

      this.jingtaiAttribute = res1.data;


    },

    // 添加按钮
    addParamsButton() {
      this.addDialog = true;
    },
    addAttrButton() {
      this.addDialog = true;
    },

    // 关闭添加参数对话框 
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 确认添加参数
    addRequest() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加参数失败！');
        // 判断是添加动态参数还是静态属性  activename
        if (this.activeName == 'first') {
          // 发送动态参数添加请求  many
          // categories/:id/attributes
          this.getRequest('many');
        } else {
          this.getRequest('only');
        }
      })
    },
    // 请求添加函数式
    async getRequest(ma) {
      let { data: res } = await this.axios.post(`categories/${this.isCateId}/attributes`, {
        attr_sel: ma,
        attr_name: this.addForm.attr_name
      });
      if (res.meta.status != 201) return this.$message.error('添加失败!');

      this.getCateList();
      this.handleChange();
      this.$message.success('添加成功！');
      this.addDialog = false
    },
    //动态参数编辑按钮 静态属性编辑按钮
    async editParamsButton(id) {
      // 根据id来查询
      if (this.activeName == 'firts') {
        let { data: res } = await this.axios.get(`categories/${this.isCateId}/attributes/${id}`, {
          params: {
            attr_sel: 'many'
          }

        });
        if (res.meta.status != 200) return this.$message.error('查询失败');
        this.editFrom = res.data;

      } else {
        let { data: res } = await this.axios.get(`categories/${this.isCateId}/attributes/${id}`, {
          params: {
            attr_sel: 'only'
          }
        });

        if (res.meta.status != 200) return this.$message.error('查询失败');
        this.editFrom = res.data;

      }
      this.editDialog = true
    },
    //  取消修改
    editDialogClose() {
      this.$refs.editFromRef.resetFields();
    },
    // 确定修改按钮
    editRequest() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return this.$message.error('修改失败！');
        if (this.activeName == 'first') {
          let { data: res } = await this.axios.put(`categories/${this.isCateId}/attributes/${this.editFrom.attr_id}`, {
            attr_name: this.editFrom.attr_name,
            attr_sel: 'many'
          });
          if (res.meta.status != 200) return this.$message.error('修改失败！');
          this.getCateList();
          this.handleChange();
          this.$message.success('更新成功！');
          this.editDialog = false

        } else {
          let { data: res } = await this.axios.put(`categories/${this.isCateId}/attributes/${this.editFrom.attr_id}`, {
            attr_name: this.editFrom.attr_name,
            attr_sel: 'only'
          });
          if (res.meta.status != 200) return this.$message.error('修改失败！');
          this.getCateList();
          this.handleChange();
          this.$message.success('更新成功！');
          this.editDialog = false
        }
      })



    },
    //动态参数删除按钮 静态属性删除按钮
    async deleteParamsButton(id) {

      let confirmR = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => { });
      if (confirmR != 'confirm') return this.$message('取消删除！');
      // // 确认删除  判断是删除动态参数还静态属性
      // if (this.activeName == 'first') {
      let { data: res } = await this.axios.delete(`categories/${this.isCateId}/attributes/${id}`);

      if (res.meta.status != 200) return this.$message.error('删除失败！');
      this.getCateList();
      this.handleChange();
      this.$message.success('删除成功！');

    },
    // 删除标签
    async tagClose(row, index) {
      row.attr_vals.splice(index, 1);

      let vals = row.attr_vals.join('，');
      // 1.7.5  判断是提交属性还提交参数
      if (this.activeName == 'first') {
        let { data: res } = await this.axios.put(`categories/${this.isCateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: 'many',
          attr_vals: vals
        });
        if (res.meta.status != 200) return this.$message.error('删除失败！');
        // this.getCateList();
        // this.handleChange();
        this.$message.success('更新成功！');
      } else {
        let { data: res } = await this.axios.put(`categories/${this.isCateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: 'only',
          attr_vals: vals
        });
        if (res.meta.status != 200) return this.$message.error('删除失败！');
        // this.getCateList();
        // this.handleChange();
        this.$message.success('更新成功！');
      }

    },
    // 标签和按钮
    async handleInputConfirm(row) {
      //失去焦点的时候
      // 获取到值  判断是否是空的  去空之后
      let value = row.inputValue.trim();
      if (value.length == 0) {
        row.inputVisible = false
        return
      } else {
        // 发起更新  把获取到的值添加到数组中
        row.attr_vals.push(value);
        let vals = row.attr_vals.join('，');
        if (this.activeName == 'first') {
          let { data: res } = await this.axios.put(`categories/${this.isCateId}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: 'many',
            attr_vals: vals
          });
          if (res.meta.status != 200) return this.$message.error('删除！');
          // this.getCateList();
          row.inputVisible = false;
          row.inputValue = ''
          // this.handleChange();
          this.$message.success('更新成功！');
        } else {
          let { data: res } = await this.axios.put(`categories/${this.isCateId}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: 'only',
            attr_vals: vals
          });
          if (res.meta.status != 200) return this.$message.error('删除失败！');
          // this.getCateList();
          row.inputVisible = false;
          this.inputValue = ''
          // this.handleChange();
          this.$message.success('更新成功！');
        }

      }
    },
    // 点击按钮切入到input框中
    showInput(row) {
      row.inputVisible = true;

      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },


    paranshandleClick() {
    },
  },
  computed: {
    isCateId() {
      // isCate  选中的三级id
      if (this.clickKeys.length != 3) {
        return null
      } else {
        return this.clickKeys[2]
      }
    },
    // 判断是否选中了  没有选中按钮禁用
    isButtonDIS() {
      if (this.clickKeys.length != 3) {
        return true
      } else {
        return false
      }

    },
    tittleText() {
      if (this.activeName == 'first') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  components: {


  },
};
</script>

<style scoped lang="less"></style>
