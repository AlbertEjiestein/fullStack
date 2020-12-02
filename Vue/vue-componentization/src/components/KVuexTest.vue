<template>
  <div>
    <p>{{ $store.state.count }}</p>
    <p>{{ $store.getters.score }}</p>
    <input type="button" value="add" @click="increment" />
    <input type="button" value="asyncAdd" @click="asyncIncrement" />
  </div>
</template>
<script>
export default {
  name: "KVuexTest",
  data() {
    return {};
  },
  methods: {
    increment() {
      this.$store.commit("increment");
    },
    async asyncIncrement() {
      const result = await this.$store.dispatch("asyncIncrement");
      if (result.ok === 1) {
        alert("操作成功!");
      }
    },
  },
};
</script>