<template>
  <input type="text" :value="value" @input="onInput" >
</template>
<script>
export default {
  name: "KInput",
  data () {
    return {
      username: "coderyao"
    };
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);

      // 告诉父组件输入的值，用于校验
      this.$parent.$emit("validate");
    }
  }
}
</script>
<style lang="scss" scoped>
</style>