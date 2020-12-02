<template>
  <div>
    <p>{{ $store.state.a.count }}</p>
    <p>{{ $store.getters['a/score'] }}</p>
    <input type="button" value="add" @click="increment" />
    <input type="button" value="asyncAdd" @click="asyncIncrement" />
  </div>
</template>
<script>
export default {
  name: "VuexTest",
  data() {
    return {};
  },
  methods: {
    increment() {
      this.$store.commit("a/increment");
    },
    async asyncIncrement() {
      const result = await this.$store.dispatch("a/asyncIncrement");
      if (result.ok === 1) {
        alert("操作成功!");
      }
    },
  },
};
</script>