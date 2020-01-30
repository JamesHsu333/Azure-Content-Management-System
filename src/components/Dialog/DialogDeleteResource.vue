<template lang="pug">
    el-dialog(title="Resources" :visible.sync="isVisible" width="75%" :before-close='closeDialog' close-on-click-modal=false)
      .filter-container
        el-input.filter-item(v-model="search" placeholder='Name or Location' style='width: 200px;' size='mini')
      el-table(ref="ResourceList" v-loading="listLoading" stripe fit highlight-current-row
        :data="filterResourceInfo"
        :default-sort="{prop: 'name', order: 'descending'}"
        @selection-change="selectResource")
        el-table-column(type="selection" width="50")
        el-table-column(width="200" label="Resource Name" prop="name" sortable)
          template(slot-scope="scope")
            i.el-icon-menu
            | {{ scope.row.name }}
        el-table-column(label="Type" align="center" width="400")
          template(slot-scope="scope")
            span
              | {{ scope.row.type }}
        el-table-column(label="Location" width="110" align="center")
          template(slot-scope="scope")
            el-tag(:type="scope.row.location")
              | {{ scope.row.location }}
        el-table-column(label="Operation" width="110")
          template
            el-button(size="mini" type="danger")
              | Delete
      span.dialog-footer(slot="footer")
        el-button(:key="selectedResourceID.length===0 ? true : false "
          type="danger"
          :loading="listLoading"
          :disabled="selectedResourceID.length===0 ? true : false "
          @click="deleteSelectedResources()")
          | Delete Selected Resources
</template>
<script>
import { deleteResourceById } from "../../api/azure";
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    resource: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      listLoading: false,
      search: "",
      selectedResourceID: []
    };
  },
  computed: {
    filterResourceInfo() {
      return this.resource.filter(
        data =>
          !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.location.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    deleteSelectedResources() {
      this.listLoading = true;
      Promise.all(
        this.selectedResourceID.map(value => {
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
        res => {
          console.log(res);
          this.resource = this.resource.filter(
            value => !this.selectedResourceID.includes(value)
          );
          this.selectedResourceID = [];
          this.$message({
            message: "Successful Delete Resources",
            type: "success"
          });
          this.listLoading = false;
        },
        () => {
          this.listLoading = false;
        }
      );
    },
    selectResource(value) {
      this.selectedResourceID = value;
      console.log(this.resource.type)
    },
    closeDialog() {
      this.$emit("close", false);
    }
  }
};
</script>