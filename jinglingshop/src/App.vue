<template>
  <div id="app">

    <router-view></router-view>

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

<style  lang="less">
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  min-width: 1024px;

}

ul {
  list-style: none;
}

a {
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>

