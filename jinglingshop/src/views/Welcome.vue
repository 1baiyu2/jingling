<template>
  <div class="welcomeBox">

    <img src="../assets/jinglingBg.png" alt="">

    <p>欢迎来到 <span>精灵购物</span>平台管理系统</p>


    <span>
      <span>老陈前端课堂版权所有©2023</span>
      <br>
      <span>@ChenFuguo互联网技术传播者</span>
    </span>


  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {

    };
  },
  methods: {

  },
  components: {

  },
};
</script>

<style scoped lang="less">
.welcomeBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  align-items: center;


  img {
    width: 560px;
    height: 250px;
  }

  p {
    font-size: 45px;

    font-weight: 600;
    letter-spacing: 2px;
    padding: 50px 0;
    margin-top: 50px;

    span {
      font-size: 70px;
      color: aqua;
    }
  }

  span {
    font-size: 12px;
    color: gray;
    margin-top: 120px;
  }
}
</style>
