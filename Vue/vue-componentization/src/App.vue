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
        <button @click="onLogin">登录</button>
      </KFormItem>
    </KForm>
  </div>
</template>

<script>
import KForm from './components/KForm.vue';
import KFormItem from './components/KFormItem';
import KInput from './components/KInput.vue';

export default {
  name: 'App',
  components: {
    KForm,
    KFormItem,
    KInput
  },
  data() {
    return {
      model: {
        username: "tom",
        password: ""
      },
      rules: {
        username: {required: true, message: "用户名必填项"},
        password: {required: true, message: "密码必填项"}
      }
    }
  },
  methods: {
    onLogin() {
      this.$refs.loginForm.validate(isValid => {
        if(isValid){
          alert("登录！");
        }else{
          alert("有错！")
        }
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
