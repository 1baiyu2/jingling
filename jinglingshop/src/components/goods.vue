<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <!-- 添加商品和搜索商品 -->
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="goodsInfo.query" class="input-with-select" style="width: 400px;">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
        <el-button type="primary" style="margin-left:  15px;" @click="addgoodsButton">添加商品</el-button>
      </div>
      <!-- 商品信息表格 -->
      <template>
        <el-table border stripe :data="goodsList" style="width: 100%;font-size: 12px; margin-top: 15px;">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="680">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="150">
            <template slot-scope="scope">
              {{ scope.row.add_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"
                @click="editButton(scope.row.goods_id)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteButton(scope.row.goods_id
              )"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 底部分页 -->
      <el-pagination style="margin-top: 15px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum" :page-sizes="[5, 10, 20, 50]" :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!-- 编辑商品信息对话框 -->
      <el-dialog title="修改商品信息" :visible.sync="editDialog" width="50%" @close="editDialogClose">
        <!-- 编辑信息表单 -->
        <el-form :model="editGoodsForm" :rules="editGoodsFormRules" ref="editGoodsFormRef" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="add_time">
            <el-input v-model="editGoodsForm.add_time"></el-input>
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
      goodsList: [],
      // 请求数据携带的参数
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 编辑商品信息
      editGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        add_time: '',
        goods_number: '',
        goods_introduce: '',
        pics: '',
        attrs: '',
      },
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        add_time: [
          { required: true, message: '请输入商品创建时间', trigger: 'blur' }
        ]
      },
      editDialog: false,

    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      let { data: res } = await this.axios.get('goods', {
        params: this.goodsInfo
      });
      console.log(res);
      if (res.meta.status != 200) return this.$message.error('获取商品列表失败');
      this.goodsList = res.data.goods;
      this.total = res.data.total
    },
    // 添加 商品跳转到添加商品页
    addgoodsButton() {
      this.$router.push('/home/add');
    },
    // 分页部分
    handleSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.goodsInfo.pagenum = newPage;
      this.getGoodsList();

    },
    // 修改按钮
    async editButton(id) {
      let { data: res } = await this.axios.get('goods/' + id);
      if (res.meta.status != 200) return this.$message.error('获取数据失败');
      this.editGoodsForm = res.data;
      this.editDialog = true
    },
    // 取消重置
    editDialogClose() {
      this.$refs.editGoodsFormRef.resetFields();
    },
    // 确认修改
    editRequest() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改失败');
        console.log(this.editGoodsForm);

        let { data: res } = await this.axios.put(`goods/${this.editGoodsForm.goods_id}`, this.editGoodsForm);
        if (res.meta.status != 200) return this.$message.error('修改商品失败');
        this.$message.success(`${res.meta.msg}`);
        this.getGoodsList();
        this.editDialog = false;
      })
    },
    // 删除按钮
    async deleteButton(id) {
      let confirmR = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => { });
      if (confirmR != 'confirm') {
        return this.$message('取消删除');
      } else {
        // 发起删除请求
        let { data: res } = await this.axios.delete('goods/' + id);
        if (res.meta.status != 200) return this.$message.error(`${res.meta.msg}`);
        this.$message.success(`${res.meta.msg}`);
        this.getGoodsList();

      }
    }

  },
  components: {

  },
};
</script>

<style scoped lang="less"></style>
