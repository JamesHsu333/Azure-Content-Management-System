<template lang="pug">
  .navbar
    hamburger(:is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSidebar")
    breadcrumb.breadcrumb-container
    .right-menu
      el-dropdown.avatar-container.right-menu-item(trigger="click")
        .avatar-wrapper
          p.user-info
            | {{name}}
          img.user-avatar(src="https://miro.medium.com/max/650/1*pk4gPFD0OLeKbwKlN1v9YA.png")
          i.el-icon-caret-bottom
        el-dropdown-menu.user-dropdown(slot="dropdown")
          router-link(to="/")
            el-dropdown-item
              | Home
          router-link(to="/profile")
            el-dropdown-item
              | Profile
          el-dropdown-item(divided)
            span(style="display:block" @click="logout()")
              | Log Out
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'name',
      'account',
      'sidebar'
    ])
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("app/toggleSidebar")
    },
    async logout() {
      await this.$store.dispatch("logout");
    }
  }
};
</script>

<style>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.navbar .hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.hamburger-container :hover {
  background-color: rgba(0, 0, 0, 0.25);
}
.breadcrumb-container {
  float: left;
}
.right-menu {
  float: right;
  height: 100%;
}
.right-menu :focus {
  outline: none;
}
.right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
}

.right-menu .right-menu-item :hover {
  background: rgba(0, 0, 0, 0.025);
}

.right-menu .avatar-container {
  margin-right: 30px;
}

.right-menu .avatar-container .avatar-wrapper {
  margin-top: 5px;
  position: relative;
}

.right-menu .avatar-container .avatar-wrapper .user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}
.el-dropdown-menu a {
  display: block;
}
.user-info {
  display: inline-block;
  font-weight: 100;
  font-size: 14px;
  color: #606266;
  padding: 0px 10px;
  vertical-align: bottom;
}
</style>