<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "KForm",
  data () {
    return {
    };
  },
  provide() {
    return {
      form: this
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object
  },
  methods: {
    validate(cb) {
      const tasks = this.$children
        .filter(child => child.prop)
        .map(child => child.validate());
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false))
    }
  }
}
</script>
<style lang="scss" scoped>
</style>