<template lang="pug">
  .sidebar-logo-container(:class="{'collapse':collapse}")
    transition(name="sidebarLogoFade")
      router-link(v-if="collapse" key="collapse" class="sidebar-logo-link" to="/")
        img.sidebar-logo(v-if="logo" :src="logo")
        h1.sidebar-title(v-else)
          | {{ title }}
      router-link.sidebar-logo-link(v-else key="expand" to="/")
        img.sidebar-logo(v-if="logo" :src="logo")
        h1.sidebar-title
          | {{ title }}
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: "Azure x eCloudture",
      logo:
        ""
    };
  }
};
</script>

<style>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
}

.sidebar-logo-link {
    height: 100%;
    width: 100%;
}
.sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
}

.sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
}
  

.collapse > .sidebar-logo {
      margin-right: 0px;
}
</style>
