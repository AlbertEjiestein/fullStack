<template>
  <div id="app">
    <KForm :rules="rules" :model="model" ref="loginForm">
      <KFormItem label="用户名" prop="username">
        <KInput v-model="model.username" />
      </KFormItem>
      <KFormItem label="密码" prop="password">
        <KInput v-model="model.password" />
      </KFormItem>
      <KFormItem>
        <!-- <KCheckBox v-model="model.remember" /> -->
        <KCheckBox :model="model.remember" @change="model.remember = $event" />
      </KFormItem>
      <KFormItem>
        <button @click="onLogin">登录</button>
      </KFormItem>
    </KForm>
  </div>
</template>

<script>
import KForm from "./KForm.vue";
import KFormItem from "./KFormItem";
import KInput from "./KInput.vue";
import KCheckBox from "./KCheckBox";
import Notice from "../Notice";
import create from '../utils/create';

export default {
  components: {
    KForm,
    KFormItem,
    KInput,
    KCheckBox
  },
  data() {
    return {
      model: {
        username: "tom",
        password: "",
        remember: false,
      },
      rules: {
        username: { required: true, message: "用户名必填项" },
        password: { required: true, message: "密码必填项" },
      },
    };
  },
  methods: {
    onLogin() {
      this.$refs.loginForm.validate((isValid) => {
        const notice = create(Notice, {
          title: "xxx",
          message: isValid ? "登录!" : "有错!",
          duration: 10000
        })
        notice.show();
      });
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>