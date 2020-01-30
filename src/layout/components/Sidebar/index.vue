/* eslint-disable vue/max-attributes-per-line */
<template lang="pug">
  div
    logo(v-if="showLogo" :collapse="isCollapse")
    el-scrollbar(wrap-class="scrollbar-wrapper")
      el-menu(:default-active="activeMenu" :collapse="isCollapse" background-color="#fff" text-color="#bfcbd9" :unique-opened="false" active-text-color="#409EFF" :collapse-transition="false" mode="vertical")
        sidebar-item(v-for="route in routes" :key="route.path" :item="route" :base-path="route.path")
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return false;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>