<template lang="pug">
  section.app-main
    transition(name="fade-transform" mode="out-in")
      router-view(:key="key")
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.app-main {
  padding-top: 50px;
}

.el-popup-parent--hidden .fixed-header {
  padding-right: 15px;
}

</style>
