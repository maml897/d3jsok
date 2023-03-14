<template>
  <router-view></router-view>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'App',
  data() {
    return {
      datas: [],
      dom: null,
      svg: null,
      test: '',
    };
  },
  mounted() {},
};
</script>
