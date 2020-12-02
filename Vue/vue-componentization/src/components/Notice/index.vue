<template>
  <div v-if="isShow">
    <p>{{title}}</p>
    <h3>{{message}}</h3>
  </div>
</template>

<script>
export default {
  name: "Notice",
  data() {
    return {
      isShow: false
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(() => {
        this.hide();
      }, this.duration);
    },
    hide() {
      this.isShow = false;
      this.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>