<template lang="pug">
  el-breadcrumb.app-breadcrumb(separator="/")
    transition-group(name="breadcrumb")
      el-breadcrumb-item(v-for="(item, index) in levelList" :key="item.path")
        span.no-redirect(v-if="item.redirect==='noRedirect' || index==levelList.length-1")
          | {{ item.meta.title }}
        a(v-else @click.prevent="handleLink(item)")
          | {{ item.meta.title }}
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      const first = matched[0];

      if (!this.isDashboard(first)) {
        matched = [{ path: "/dashboard", meta: { title: "Dashboard" } }].concat(
          matched
        );
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    },
    handleLink(item) {
      const { redirect, path } = item;

      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(path);
    }
  }
};
</script>

<style>
.app-breadcrumb {
  display: inline-block;
  margin-left: 8px;
}
.el-breadcrumb {
  line-height: 50px !important;
}
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>