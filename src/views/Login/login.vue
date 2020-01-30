<template lang="pug">
  .login
    el-card.box
      div(slot="header")
        h1.title
          | Azure x ecloudture
      el-button(round type="primary" @click="login")
        | Login with Azure Account
</template>
<script>
export default {
  name: "Login",
  methods: {
    async login() {
      await this.$store.dispatch("login")
      await this.$store.dispatch("getUserInfo")
      this.$router.push("/");
    }
  }
};
</script>
<style>
.title {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-weight: 300;
  line-height: 1.2;
}

.login {
  min-height: 100%;
  height: 100%;
  width: 100%;
  text-align: center;
}

.box {
  width: 460px;
  margin: auto;
}

.logo {
  width: 50%;
}
</style>