<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }" style="color: white;">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px;">
      <div id="main" style="width: 600px; height: 400px;"></div>

    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {

  },
  data() {
    return {

      options: {
        title: {
          text: '用户来源'
        },
        color: ['rgb(213,114,111)', 'rgb(110,125,136)', 'rgb(145,189,195)', 'rgb(225,168,148)', 'rgb(178,216,199)'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },


    };
  },
  async mounted() {
    let { data: res } = await this.axios.get('reports/type/1');
    console.log(res);
    if (res.meta.status != 200) return this.$message.error('获取报表失败');
    let option = _.merge(this.options, res.data);
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(option)
  },
  methods: {



    // 合并两个对象

  },
  components: {

  },
};
</script>

<style scoped lang="less"></style>

