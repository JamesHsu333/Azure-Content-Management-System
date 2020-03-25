<template lang="pug">
  .app-container
    .filter-container
      el-input.filter-item(v-model="search" placeholder='Name or Email' style='width: 200px;' size='mini')
      el-button.filter-item(style='margin-left: 10px;' type='primary' icon='el-icon-edit' size='mini' @click='dialogFormVisible=true')
        | Create User
      el-button.filter-item(style='margin-left: 10px;' type='danger' icon='el-icon-delete' size='mini' :disabled='selectedUser.length===0 ? true : false ' @click="deleteConfirm(deleteSelectedUser, 'Delete Selected User')")
        | Delete Selected User
    el-table(v-loading="listLoading"
    :data="filterUserInfo"
    element-loading-text="Loading User Information" fit 
    @selection-change='selectUser' :default-sort="{prop: 'name', order: 'ascending'}")
      el-table-column(type="selection" width="50")
      el-table-column(align='center' width='120' label='Name' prop='name' sortable)
        template(slot-scope='scope')
          | {{ scope.row.displayName }}
      el-table-column(label='Account Name' align='center')
        template(slot-scope='scope')
          span
            | {{ scope.row.userPrincipalName }}
      el-table-column(label='Operation' width='300')
        template
          el-button(icon='el-icon-delete' size='mini' type='danger')
            | Delete User

    form-create-user(:isVisible='dialogFormVisible' @close="closeCreateUserForm" @newUserData="newUserData")
</template>

<script>
import { listUser, deleteUser } from "../../api/graph.js";
import FormCreateUser from "../../components/Form/FormCreateUser";

export default {
  components: {
    FormCreateUser
  },
  data() {
    return {
      list: [{}],
      listLoading: false,
      selectedUser: [],
      dialogFormVisible: false,
      search: ""
    };
  },
  computed: {
    filterUserInfo() {
      return this.list.filter(
        data =>
          !this.search ||
          data.displayName.toLowerCase().includes(this.search.toLowerCase()) ||
          data.userPrincipalName
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        this.listLoading = true;
        let res = await listUser();
        this.list = res.data.value;
        this.listLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    deleteSelectedUser() {
      Promise.all(
        this.selectedUser.map(value => {
          deleteUser(value.id);
        })
      ).then(() => {
        this.list = this.list.filter(
          value => !this.selectedUser.includes(value)
        );
        this.$message({
          message: "Successful Delete User",
          type: "success"
        });
      });
    },
    selectUser(value) {
      this.selectedUser = value;
    },
    deleteConfirm(method, message) {
      this.$confirm("Do you want to " + message, message, {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          method();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Has Canceled"
          });
        });
    },
    closeCreateUserForm(data) {
      this.dialogFormVisible = data;
    },
    newUserData(data) {
      this.$set(this.list, this.list.length, data);
    }
  }
};
</script>
