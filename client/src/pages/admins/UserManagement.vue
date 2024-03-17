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

      <v-dialog v-model="addFormDialog" max-width="600" persistent scrollable>
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

<script>
import UserService from '~/services/UserService';
import DataTable from '~/components/admin/DataTable.vue';
import UserForm from '~/components/admin/UserForm.vue';
export default {
   components: {
      DataTable,
      UserForm,
   },
   data() {
      return {
         tableHeaders: [
            'Mã số sinh viên',
            'Mật khẩu',
            'Tên',
            'Giới tính',
            'Ngày sinh',
            'Khoa',
            'Lớp',
            'Tạo lúc',
            'Cập nhật lúc',
            'Đã xoá',
         ],
         users: [],
         usersCount: 0,
         userProperties: [],
         userActive: {},
         updateFormDialog: false,
         addFormDialog: false,
      };
   },

   methods: {
      convertTimestamp(timestamp) {
         const date = new Date(timestamp);
         return date.toLocaleString('vi-VN');
      },
      async getUsers() {
         try {
            this.users = await UserService.getAll();
            this.users.map((user) => {
               user.createdAt = this.convertTimestamp(user.createdAt);

               user.updateAt
                  ? (user.updateAt = this.convertTimestamp(user.updateAt))
                  : null;
            });
            this.usersCount = this.users.length;
            this.userProperties = Object.keys(this.users[0]);
            console.log(this.userProperties);
         } catch (error) {
            console.log(error);
         }
      },

      sortUsersByDate() {
         return this.users.sort(
            (userA, userB) =>
               new Date(userB.createdAt) - new Date(userA.createdAt)
         );
      },

      async addUser(data) {
         try {
            await UserService.create(data);
            this.addFormDialog = false;
            await this.refreshUser();
         } catch (error) {
            console.log(error);
         }
      },

      async updateUser(data) {
         try {
            this.updateFormDialog = false;
            await UserService.updateOne(data._id, data);
            await this.refreshUser();
         } catch (error) {
            console.log(error);
         }
      },

      submitUpdateUserForm() {
         if (this.$refs.updateForm) {
            this.$refs.updateForm.onSubmit();
         }
      },

      submitAddUserForm() {
         if (this.$refs.addForm) {
            this.$refs.addForm.onSubmit();
         }
      },

      async setActiveUser(user) {
         this.userActive = await UserService.findOneById(user._id);
         this.updateFormDialog = true;
      },

      async refreshUser() {
         await this.getUsers();
         this.sortUsersByDate();
      },

      async deleteUser(user) {
         try {
            await UserService.deleteOne(user._id);
            await this.refreshUser();
         } catch (error) {
            console.log(error);
         }
      },
   },

   mounted() {
      this.refreshUser();
   },
};
</script>

<style scoped></style>
