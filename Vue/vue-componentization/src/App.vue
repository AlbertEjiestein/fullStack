<template>
  <div id="app">
    <!-- <FormTest /> -->
    <!-- <Tree /> -->
    <router-link to="/" exact>Home </router-link>
    <router-link to="/list">List </router-link>
    <router-link to="/about">About</router-link>
    <router-view />
  </div>
</template>
<script>
import FormTest from "./components";
import Tree from "./tree";

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    FormTest,
    Tree,
  },
};
</script>
<style lang="scss" scoped>
</style>