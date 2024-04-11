<template>
   <v-app-bar style="position: fixed">
      <v-spacer></v-spacer>
      <v-btn @click="refreshUser">Làm mới dữ liệu</v-btn>

      <v-btn @click="addFormDialog = true">Thêm người dùng mới</v-btn>
      <v-btn>Xoá tất cả</v-btn>
      <v-spacer></v-spacer>
   </v-app-bar>
   <data-table
      :items="users"
      :itemProperties="
         userProperties.filter((prop) => prop !== '_id' && prop !== 'slug')
      "
      :itemsCount="usersCount"
      :tableHeaders="tableHeaders"
      :sort-by="USER_SORT_BY"
      :sort-type="SORT_TYPE"
      @item-active="setActiveUser"
      v-if="usersCount > 0"
   ></data-table>
   <p v-else>Không tìm thấy dữ liệu người dùng.</p>

   <div class="text-center pa-4">
      <v-dialog
         v-model="updateFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Sửa thông tin người dùng">
            <v-divider></v-divider>

            <v-card-text>
               <user-form
                  :user="userActive"
                  @submitUser="updateUser"
                  ref="updateForm"
               ></user-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="updateFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitUpdateUserForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog
         v-model="addFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Thêm người dùng mới">
            <v-divider></v-divider>

            <v-card-text>
               <user-form
                  :user="{}"
                  ref="addForm"
                  @submitUser="addUser"
               ></user-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="addFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitAddUserForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script setup>
   import UserService from '~/services/UserService';
   import DataTable from '~/components/admin/DataTable.vue';
   import UserForm from '~/components/admin/UserForm.vue';
   import {
      USER_TABLE_HEADERS,
      USER_SORT_BY,
      SORT_TYPE,
   } from '~/utils/constants';
   import { convertTimestamp } from '~/utils/algorithms';
   import { onMounted, ref } from 'vue';

   const users = ref(null);
   const usersCount = ref(0);
   const userProperties = Object.keys(USER_TABLE_HEADERS);
   const tableHeaders = Object.values(USER_TABLE_HEADERS);

   const addFormDialog = ref(false);
   const updateFormDialog = ref(false);

   const addForm = ref(null);
   const updateForm = ref(null);
   const submitAddUserForm = () => {
      addForm.value.onSubmit();
   };
   const submitUpdateUserForm = () => {
      updateForm.value.onSubmit();
   };

   const userActive = ref(null);
   const setActiveUser = async (user) => {
      userActive.value = await UserService.findOneById(user._id);
      updateFormDialog.value = true;
   };

   const convertUserTimestamp = () => {
      users.value.map((user) => {
         user.createdAt = convertTimestamp(user.createdAt);

         user.updatedAt
            ? (user.updatedAt = convertTimestamp(user.updatedAt))
            : null;
      });
   };

   const getUsers = async () => {
      try {
         users.value = await UserService.getAll();
         usersCount.value = users.value.length;
      } catch (error) {
         console.log(error);
      }
   };

   const addUser = async (data) => {
      try {
         await UserService.create(data);
         addFormDialog.value = false;
         await refreshUser();
      } catch (error) {
         console.log(error);
      }
   };

   const updateUser = async (data) => {
      try {
         updateFormDialog.value = false;
         await UserService.updateOne(data._id, data);
         await refreshUser();
      } catch (error) {
         console.log(error);
      }
   };

   const refreshUser = async () => {
      await getUsers();
      await convertUserTimestamp();
   };

   onMounted(async () => {
      await refreshUser();
   });
</script>

<style scoped></style>
