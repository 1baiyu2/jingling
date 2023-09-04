<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top: 15px;">
      <el-alert title="消息提示的文案" type="info" show-icon center :closable="false">
      </el-alert>

      <div class="content">
        <el-steps style="margin-top: 15px;margin-left: 20px; font-size: 12px; width: 100%;" :space="200"
          :active="Number(activeIndex)" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form style="margin-top: 15px; width: 100%; height: 100%;">
          <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beleTabs" @tab-click="tabClicked">
            <el-tab-pane name="0" label="基本信息">
              <el-form label-position="top" :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addFrom.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addFrom.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addFrom.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addFrom.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <!-- 级联选择器 -->
                  <el-cascader :clearable="true" v-model="selectKeys" :options="cateList" :props="cateProps"
                    expandTrigger='hover' @change="handleChange"></el-cascader>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品参数">
              <el-form-item style="margin-left: 0px;" v-for="(item, index) in paramsList" :keys="item.attr_id">
                {{ item.attr_name }}
                <!-- 复选框 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="it" v-for="(it, i) in item.attr_vals" :keys="i" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
              <el-form-item style="margin-left: 0px;" v-for="(item, index) in attributeList" :keys="item.attr_id">
                {{ item.attr_name }}
                <!-- 输入框 -->
                <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
              <!-- 上传图片 -->
              <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                :on-success="handeleSuccess" :headers="headerObj" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
              <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
              <el-button style="margin-top: 15px;" type="primary" @click="add">添加商品</el-button>
            </el-tab-pane>

          </el-tabs>
        </el-form>
      </div>
    </el-card>
    <!--图片预览  -->
    <el-dialog title="图片预览" :visible.sync="previewPicture" width="50%">
      <img :src="imgUrl" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewPicture = false">取 消</el-button>
        <el-button type="primary" @click="previewPicture = false">确 定</el-button>
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
      activeIndex: '0',
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 选中的keys值
      selectKeys: [],
      addFrom: {
        // 商品名称
        goods_name: '',
        // 以为','分割的分类列表
        goods_cat: '',
        // 价格
        goods_price: 0,
        goods_weight: 0,
        // 数量
        goods_number: 0,
        // 重量

        // 介绍
        goods_introduce: '',
        // 上传的图片临时路径（对象）
        pics: [],
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: [],
      },
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入分类参数', trigger: 'blur' }
        ]
      },
      tabAble: false,
      // 商品参数
      // 动态参数列表
      paramsList: [],
      // 静态属性列表
      attributeList: [],
      uploadUrl: 'http://www.chenfuguo.cn:8899/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览对话框
      previewPicture: false,
      imgUrl: '',


    };
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    // 获取到所有的三级分类列表
    async getCateList() {
      let { data: res } = await this.axios.get('categories');
      if (res.meta.status != 200) return this.$message.error('请求失败！');
      this.cateList = res.data
    },
    // 组件在离开的时候会触发的函数  前一个值 后一个值
    beleTabs(activeName, oldActiveName) {
      if (this.selectKeys.length < 3 && oldActiveName == '0') {

        this.$message.error('请选择商品分类');
        return false
      }
    },
    handleChange() {
      if (this.selectKeys.length == 3) {
        this.addFrom.goods_cat = this.selectKeys.join(',')
      }
    },
    // 选中面板的时候进行触发
    async tabClicked() {
      if (this.activeIndex == '1') {
        // 动态参数请求
        let { data: res } = await this.axios.get(`categories/${this.selectKeys[2]}/attributes`, {
          params: {
            sel: 'many'
          }
        });
        if (res.meta.status != 200) return this.$message.error('获取失败');

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length == 0 ? '' : item.attr_vals.split('，');
        })
        this.paramsList = res.data;

        // 对attr_vals进行字符串分割

      }
      if (this.activeIndex == '2') {
        // 静态属性请求
        let { data: res } = await this.axios.get(`categories/${this.selectKeys[2]}/attributes`, {
          params: {
            sel: 'only'
          }
        });
        if (res.meta.status != 200) return this.$message.error('获取失败');

        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.length == 0 ? '' : item.attr_vals.split('，');
        // })
        this.attributeList = res.data;
      }

    },
    // 上传图片成功的操作
    handeleSuccess(response) {

      // 把添加成功的图片临时路径  添加到pics数组中
      let tempath = { "pic": response.data.tmp_path };
      this.addFrom.pics.push(tempath);

    },
    // 预览图片
    handlePreview(file) {
      let imgurl = file.response.data.url;
      this.imgUrl = imgurl;
      this.previewPicture = true
    },
    //删除图片
    handleRemove(file) {
      // 根据图片临时路径找到pics中的index 根据index进行删除图片的临时路径
      let imgUrl = file.response.data.tmp_path;
      let index = this.addFrom.pics.findIndex(x => x.pic = imgUrl);
      this.addFrom.pics.splice(index, 1);

    },
    // 添加商品按钮
    add() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('添加商品失败！');

        // attrs商品的参数（数组），包含 `动态参数` 和 `静态属性` 1335,1350,1359
        // 三级分类id  级联选择器必须是数组  提交的时候是字符串
        // 所以要进行深拷贝
        let form = _.cloneDeep(this.addFrom);

        // form.goods_cat = form.goods_cat.join(',');
        // 处理动态参数  和静态属性
        //  this.attributeList

        this.paramsList.forEach(item => {
          let attrs = item.attr_vals.length == 0 ? '' : item.attr_vals.join('，');

          let value = {
            "attr_id": item.attr_id,
            "attr_value": attrs
          }
          form.attrs.push(value)
        })
        this.attributeList.forEach(item => {


          let value = {
            "attr_id": item.attr_id,
            "attr_value": item.attr_vals
          }
          form.attrs.push(value)
        });

        let { data: res } = await this.axios.post('goods', form);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success('添加商品成功！');
        this.$router.push('/home/goods')

        // 
      })
    }

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.content {
  width: 95%;
  margin: auto;
  font-size: 14px;
  // background-color: aquamarine;
}
</style>
