<template lang="pug">
    el-dialog(title='Create User' :visible.sync='isVisible' :before-close='closeDialog')
      el-tabs(v-model='nowTab' stretch=true)
        el-tab-pane(label='Create User' name='first')
          el-form(ref='createUserForm' :model='createUserForm' :rules='rules' label-position='right' label-width='125px' style='width: 350px; margin-left:70px;')
            el-form-item(label='User Name' prop='name')
              el-input(v-model='createUserForm.name' prefix-icon='el-icon-user' size='medium' clearable='')
            el-form-item(label='Assign Role' prop='isAssign')
                el-switch(v-model='createUserForm.isAssign' style='left:0')
            el-form-item(v-if='createUserForm.isAssign' label='Resource Group' prop='resourceGroupName')
              el-select(v-model='createUserForm.resourceGroupName' filterable='' placeholder='Choose Resource Group' multiple='' collapse-tags='')
                el-option(v-for='resourceGroup in resourceGroups' :key='resourceGroup.name' :label='resourceGroup.name' :value='resourceGroup.name')
            el-form-item(v-if='createUserForm.isAssign' label='Role' prop='roleDefinitionId')
              el-select(v-model='createUserForm.roleDefinitionId' filterable='' placeholder='Choose Role')
                el-option(v-for='role in roles' :key='role.name' :label='role.name' :value='role.GUID')
        el-tab-pane(label='Create Multiple User' name='second')
          el-form(ref='createMultiUserForm' :model='createMultiUserForm' label-position='left' :rules='rules' label-width='125px' style='width: 350px; margin-left:70px;')
            el-form-item(label='User Name' prop='name')
              el-input(v-model='createMultiUserForm.name' prefix-icon='el-icon-user' size='medium' clearable='')
            el-form-item(label='User Numbers' prop='range') 
              el-slider(v-model="createMultiUserForm.range" range show-stops :max="50")
            el-form-item(label='Assign Role' prop='isAssign')
              el-switch(v-model='createMultiUserForm.isAssign' style='left:0')
            el-form-item(v-if='createMultiUserForm.isAssign' label='Role' prop='roleDefinitionId')
              el-select(v-model='createMultiUserForm.roleDefinitionId' filterable='' placeholder='Choose Role')
                el-option(v-for='role in roles' :key='role.name' :label='role.name' :value='role.GUID')
          el-alert(v-if='createMultiUserForm.isAssign' title="Please make sure that Resource Group is exist before assign role" type="warning" :closable="false" style="margin-bottom: 20px")
          el-alert(v-if='createMultiUserForm.isAssign' title="User will assign to Resource Group of which name equals to User Name" type="info" :closable="false" style="margin-bottom: 20px")
      .dialog-footer(slot='footer')
        el-button(@click="$emit('close', false)") Cancel
        el-button(type='primary' @click="nowTab==='first' ? confirmCreateUserForm() : confirmCreateMultiUserForm()")
          | Confirm
</template>
<script>
import { createUser } from "../../api/graph.js";
import { listResourceGroup, createRoleAssignment } from "../../api/azure.js";
import { generatePassword, generateGUID } from "../../utils/generate.js";

export default {
  name: "CreateUserForm",
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      nowTab: "first",
      isFormValid: false,
      resourceGroups: [{}],
      createUserForm: {},
      createMultiUserForm: { range: [1, 15] },
      rules: {
        name: [
          { required: true, message: "Type User Name", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "User Name must have length between 5 to 16",
            trigger: "blur"
          }
        ],
        assignRG: [
          {
            required: true,
            message: "Please Choose Resource Group",
            trigger: "change"
          }
        ],
        role: [
          { required: true, message: "Please Choose Role", trigger: "change" }
        ]
      },
      roles: [
        {
          name: "Contributer",
          GUID: "b24988ac-6180-42a0-ab88-20f7382dd24c"
        },
        {
          name: "Owner",
          GUID: "8e3af657-a8ff-443c-a75c-2fe8c4bcb635"
        },
        {
          name: "Reader",
          GUID: "acdd72a7-3385-48ef-bd42-f606fba81ae7"
        }
      ]
    };
  },
  created() {
    this.getResourceGroups();
  },
  methods: {
    async getResourceGroups() {
      let res = await listResourceGroup();
      this.resourceGroups = res.data.value;
    },
    async createUser(name) {
      let res = await createUser(name, generatePassword());
      this.$message({
        type: "success",
        message: "Successfully Create User: " + name
      });
      this.$emit("newUserData", res.data);
      return res.data;
    },
    createMultiUser({ name, range }) {
      let userName = [];
      for (let i = range[0]; i <= range[1]; i++) {
        userName[i - range[0]] = name + i.toString();
      }
      Promise.all(
        userName.map(value => {
          this.createUser(value);
        })
      );
    },
    createMultiUserRole({ name, range, roleDefinitionId }) {
      let userName = [];
      for (let i = range[0]; i <= range[1]; i++) {
        userName[i - range[0]] = name + i.toString();
      }
      Promise.all(
        userName.map(value => {
          this.createUser(value).then(res => {
            this.createRoleAssignment(res.id, {
              roleDefinitionId: roleDefinitionId,
              resourceGroupName: value
            });
          });
        })
      );
    },
    async createRoleAssignment(
      userId,
      { roleDefinitionId, resourceGroupName }
    ) {
      await createRoleAssignment({
        roleAssignName: generateGUID(),
        roleDefinitionId: roleDefinitionId,
        userId: userId,
        resourceGroupName: resourceGroupName
      });
      this.$message({
        type: "success",
        message:
          "Successfully Assign User to Resource Group: " + resourceGroupName
      });
    },
    async confirmCreateUserForm() {
      this.validateForm("createUserForm");
      if (this.isFormValid) {
        if (this.createUserForm.isAssign) {
          let user = await this.createUser(this.createUserForm.name);
          this.createRoleAssignment(user.id, this.createUserForm);
        } else if (!this.createUserForm.isAssign) {
          this.createUser(this.createUserForm.name);
        }
        this.closeDialog();
      }
    },
    async confirmCreateMultiUserForm() {
      this.validateForm("createMultiUserForm");
      if (this.isFormValid) {
        if (this.createMultiUserForm.isAssign) {
          this.createMultiUserRole(this.createMultiUserForm);
        } else if (!this.createMultiUserForm.isAssign) {
          this.createMultiUser(this.createMultiUserForm);
        }
        this.closeDialog();
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