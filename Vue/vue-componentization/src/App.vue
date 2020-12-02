<template>
  <div id="app">
    <!-- <FormTest /> -->
    <!-- <Tree /> -->
    <!-- <VuexTest /> -->
    <KVuexTest />
    <!-- <router-link to="/" exact>Home </router-link>
    <router-link to="/list">List </router-link>
    <router-link to="/about">About</router-link>
    <router-view /> -->
  </div>
</template>
<script>
import FormTest from "./components/form";
import Tree from "./components/tree";
import VuexTest from './components/VuexTest';
import KVuexTest from './components/KVuexTest';

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    FormTest,
    Tree,
    VuexTest,
    KVuexTest
  },
};
</script>
<style lang="scss" scoped>
</style>