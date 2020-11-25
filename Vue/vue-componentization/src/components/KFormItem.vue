<template>
  <div>
    <div v-if="label">{{label}}</div>
    <slot></slot>
    <p v-if="errorMessage">{{errorMessage}}</p>
  </div>
</template>
<script>
import Schema from "async-validator";

export default {
  name: "KFormItem",
  data () {
    return {
      errorMessage: ""
    };
  },
  inject: ["form"],
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: String
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    })
  },
  methods: {
    validate(){
      // 表单数据及对应匹配规则
      const value = this.form.model[this.prop];
      const rules = this.form.rules[this.prop];
      // 进行校验
      const desc = {
        [this.prop]: rules
      }
      const schema = new Schema(desc);
      return schema.validate({ [this.prop]: value }, errors => {
        if(errors) {
          this.errorMessage = errors[0].message;
        }else{
          this.errorMessage = "";
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>