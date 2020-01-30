<template lang="pug">
  .app-wrapper(:class="classObj")
    .drawer-bg(v-if="device==='mobile' && sidebar.opened" @click="handleClickOutside")
    sidebar.sidebar-container
    .main-container
      .fixed-header
        navbar
      app-main
</template>

<script>
import Navbar from "./components/Navbar";
import AppMain from "./components/AppMain";
import Sidebar from "./components/Sidebar/index";
import ResizeHandler from "./mixin/ResizeHandler";

export default {
  components: {
    Navbar,
    AppMain,
    Sidebar
  },
  mixins: [ResizeHandler],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSidebar", { withoutAnimation: false });
    }
  }
};
</script>