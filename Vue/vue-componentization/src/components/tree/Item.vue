<template>
  <li>
    <div @click="toggle">
      {{ model.title }}
      <span v-if="isFolder">{{ open ? "-" : "+" }}</span>
    </div>
    <ul v-if="isFolder" v-show="open">
      <item v-for="child in model.children" :key="child.title" :model="child"> </item>
    </ul>
  </li>
</template>
<script>
export default {
  name: "Item",
  data() {
    return {
      open: false
    };
  },
  props: {
    model: Object
  },
  computed: {
    isFolder: function() {
      return this.model.children && this.model.children.length;
    }
  },
  methods: {
    toggle() {
      this.open = !this.open;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>