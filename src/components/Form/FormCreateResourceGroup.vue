<template lang="pug">
  el-dialog(title='Create Resource Group' :visible.sync='isVisible' :before-close='closeDialog')
    el-form(ref='createResourceGroupForm' :model='createResourceGroupForm' :rules='rules' label-position='right' label-width='175px' style='width: 375px; margin-left:70px;')
      el-form-item(label='Resource Group Name' prop='name')
        el-input(v-model='createResourceGroupForm.name' :placeholder="createResourceGroupForm.isMultiple ? 'Ex. user' : 'Ex. user1'" prefix-icon='el-icon-user' size='medium' clearable)
      el-form-item(label='Region' prop='region')
        el-select(v-model='createResourceGroupForm.region' filterable placeholder='Choose Region')
          el-option(v-for='region in regions' :key='region.label' :label='region.label' :value='region.value')
      el-form-item(label='Multiple' prop='isMultiple')
        el-switch(v-model='createResourceGroupForm.isMultiple' style='left:0')
      el-form-item(v-if='createResourceGroupForm.isMultiple' label='User Numbers' prop='range') 
        el-slider(v-model="createResourceGroupForm.range" range show-stops :max="50")
    .dialog-footer(slot='footer')
      el-button(@click="closeDialog") Cancel
      el-button(type='primary' :loading="isCreateNow" @click="confirmCreateResourceGroupForm")
        | Confirm
</template>
<script>
import { createResourceGroup } from "../../api/azure.js";

export default {
  name: "FormCreateResourceGroup",
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    resourceGroup: {
      type: Array,
      required: true
    }
  },
  data() {
    let checkResourceGroupName = (rule, value, callback) => {
      let isNameExist =
        this.resourceGroup.filter(
          data => data.name.toLowerCase() === value.toLowerCase()
        ).length !== 0
          ? true
          : false;
      if (isNameExist) {
        callback(new Error("Resource Group Already Exist"));
      } else {
        callback();
      }
    };
    return {
      isFormValid: false,
      createResourceGroupForm: { range: [1, 15], isMultiple: false },
      isCreateNow: false,
      rules: {
        name: [
          {
            required: true,
            message: "Type Resource Group Name",
            trigger: "blur"
          },
          {
            validator: checkResourceGroupName,
            trigger: "blur"
          },
          {
            min: 4,
            max: 16,
            message: "Resource Group Name must have length between 5 to 16",
            trigger: "blur"
          }
        ],
        region: {
          required: true,
          message: "Choose Region",
          trigger: "blur"
        }
      },
      regions: [
        {
          value: "eastasia",
          label: "East Asia"
        },
        {
          value: "southeastasia",
          label: "Southeast Asia"
        },
        {
          value: "eastus",
          label: "East US"
        },
        {
          value: "eastus2",
          label: "East US 2"
        },
        {
          value: "northcentralus",
          label: "North Central US"
        },
        {
          value: "centralus",
          label: "Central US"
        },
        {
          value: "southcentralus",
          label: "South Central US"
        },
        {
          value: "westus",
          label: "West US"
        },
        {
          value: "westus2",
          label: "West US 2"
        },
        {
          value: "westcentralus",
          label: "West Central US"
        }
      ]
    };
  },
  methods: {
    async createResourceGroup({ name, region }) {
      let res = await createResourceGroup({
        resourceGroupName: name,
        region: region
      });
      this.$message({
        type: "success",
        message: "Successfully Create Resource Group " + name
      });
      this.$emit("newResourceGroupData", res.data);
    },
    createMultiResourceGroup({ name, region, range }) {
      let resourceGroupName = [];
      for (let i = range[0]; i <= range[1]; i++) {
        resourceGroupName[i - range[0]] = name + i.toString();
      }
      return Promise.all(
        resourceGroupName.map(value => {
          return new Promise(resolve => {
            this.createResourceGroup({
              name: value,
              region: region
            }).then(() => resolve());
          });
        })
      );
    },
    async confirmCreateResourceGroupForm() {
      this.validateForm("createResourceGroupForm");
      if (this.isFormValid) {
        this.isCreateNow = true;
        if (this.createResourceGroupForm.isMultiple === true) {
          try {
            await this.createMultiResourceGroup(this.createResourceGroupForm);
          }catch {
            this.isCreateNow = false;
          }
        } else if (this.createResourceGroupForm.isMultiple === false) {
          try {
            await this.createResourceGroup(this.createResourceGroupForm);
          }catch {
            this.isCreateNow = false;
          }
        }
        this.closeDialog();
        this.isCreateNow = false;
      }
    },
    validateForm(formName) {
      this.$refs[formName].validate(valid => {
        this.isFormValid = valid ? true : false;
      });
    },
    closeDialog() {
      this.$emit("close", false);
    }
  }
};
</script>