<template lang="pug">
  .app-container
    .filter-container
      el-input.filter-item(v-model="search" placeholder='Name or Location' style='width: 200px;' size='mini')
      el-button.filter-item(style='margin-left: 10px;' type='primary' icon='el-icon-edit' size='mini' @click="createFormVisible=true")
        | Create Resource Group
      el-button.filter-item(style='margin-left: 10px;' type='danger' icon='el-icon-delete' size='mini' :disabled='selectedResourceGroup.length===0 ? true : false ' @click="deleteConfirm(deleteSelectedResourceGroup, 'Delete Selected Resource Group')")
        | Delete Selected Resource Group
    el-table(v-loading="listLoading"
    :data="filterResourceGroupInfo" 
    element-loading-text="Loading Resource Group Information" fit
    @selection-change="selectResourceGroup" :default-sort="{prop: 'name', order: 'ascending'}")
      el-table-column(type="selection" width="50")
      el-table-column(width="300" label="Resource Group Name" prop="name" sortable)
        template(slot-scope="scope")
          i.el-icon-menu 
          | {{ scope.row.name }}
      el-table-column(label="Account Name" align="center")
        template(slot-scope="scope")
          span
            | {{ scope.row.userPrincipalName }}
      el-table-column(label="Location" width="140" align="center")
        template(slot-scope="scope")
          el-tag
            | {{ scope.row.location }}
      el-table-column(label="Operation" width="400")
        template(slot-scope="scope")
          el-button(
            icon="el-icon-delete"
            size="mini"
            type="danger"
            :loading="buttonLoading[scope.$index]"
            @click="listResources(scope.row.name, scope.$index)")
            | Delete Resource
          el-button(
            icon="el-icon-delete"
            size="mini"
            type="danger"
            :loading="buttonLoading[scope.$index]"
            @click="deleteAllResources(scope.row.name, scope.$index)")
            | Delete All
    form-create-resource-group(:isVisible="createFormVisible" :resourceGroup="list" @newResourceGroupData="newResourceGroupData" @close="closeCreateResourceGroup")
    dialog-delete-resource(:isVisible="deleteFormVisible" :resource="resource" @close="closeDeleteResource")
</template>

<script>
import {
  listResourceGroup,
  listResourceByRG,
  deleteResourceGroup,
  deleteResourceById
} from "../../api/azure.js";
import FormCreateResourceGroup from "../../components/Form/FormCreateResourceGroup";
import DialogDeleteResource from "../../components/Dialog/DialogDeleteResource";

export default {
  components: {
    FormCreateResourceGroup,
    DialogDeleteResource
  },
  data() {
    return {
      list: [{}],
      listLoading: false,
      resource: [],
      selectedResourceGroup: [],
      buttonLoading: [],
      createFormVisible: false,
      deleteFormVisible: false,
      search: ""
    };
  },
  computed: {
    filterResourceGroupInfo() {
      return this.list.filter(
        data =>
          !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.location.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  created() {
    this.getResourceGroup();
  },
  methods: {
    async getResourceGroup() {
      this.listLoading = true;
      let res = await listResourceGroup();
      this.list = res.data.value;
      for (let i = 0; i < this.list.length; i += 1) {
        this.buttonLoading[i] = false;
      }
      this.listLoading = false;
    },
    async listResources(resourceGroupName, index) {
      this.$set(this.buttonLoading, index, true);
      let res = await listResourceByRG(resourceGroupName);
      this.resource = res.data.value;
      this.$set(this.buttonLoading, index, false);
      this.deleteFormVisible = true;
    },
    deleteSelectedResourceGroup() {
      this.listLoading = true;
      Promise.all(
        this.selectedResourceGroup.map(value => {
          return new Promise(resolve => {
            deleteResourceGroup(value.name).then(() => {
              this.$message({
                type: "success",
                message: "Successfully Delete Resource Group: " + value.name
              });
              resolve();
            });
          });
        })
      ).then(() => {
        this.list = this.list.filter(
          value => !this.selectedResourceGroup.includes(value)
        );
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },
    deleteAllResources(resourceGroupName, index) {
      this.$confirm(
        "Do you want to delete all resources?",
        "Delete All Resources",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.$set(this.buttonLoading, index, true);
          listResourceByRG(resourceGroupName).then(res => {
            console.log(res.data);
            Promise.all(
              res.data.value.map(value => {
                return new Promise((resolve, reject) => {
                  deleteResourceById(value.id)
                    .then(res => {
                      resolve(res);
                    })
                    .catch(err => {
                      reject(err);
                    });
                });
              })
            ).then(
              () => {
                this.$set(this.buttonLoading, index, false);
                this.$message({
                  message: "Successfully Delete Resources",
                  type: "success"
                });
              },
              () => {
                this.$set(this.buttonLoading, index, false);
              }
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Has Canceled Deletion"
          });
        });
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
    selectResourceGroup(value) {
      this.selectedResourceGroup = value;
    },
    newResourceGroupData(data) {
      this.$set(this.list, this.list.length, data);
    },
    closeCreateResourceGroup(data) {
      this.createFormVisible = data;
    },
    closeDeleteResource(data) {
      this.deleteFormVisible = data;
    }
  }
};
</script>