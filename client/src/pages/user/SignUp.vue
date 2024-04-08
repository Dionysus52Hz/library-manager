<template>
   <v-container class="page">
      <v-row>
         <v-col class="pe-0 v-col-6 d-none d-sm-block">
            <v-card
               class="sign-up-form-bg rounded-0 rounded-s-lg"
               color="indigo-lighten-4"
            ></v-card>
         </v-col>
         <v-col class="ps-0">
            <v-card class="rounded-0 rounded-e-lg">
               <v-card-item class="py-4">
                  <v-card-title class="font-weight-bold"
                     >TẠO TÀI KHOẢN MỚI</v-card-title
                  >
               </v-card-item>

               <v-divider></v-divider>

               <v-card-text>
                  <v-form
                     class="text-primary"
                     @submit="onSubmit"
                     @keyup.enter="onSubmit"
                  >
                     <div class="font-weight-bold">Mã số sinh viên</div>

                     <v-text-field
                        v-model="userId"
                        counter="8"
                        v-bind="userIdProps"
                        placeholder="Nhập mã số sinh viên"
                        hint="Mã số sinh viên có 8 kí tự dạng Bxxxxxxx"
                        color="primary"
                        variant="outlined"
                        base-color="primary"
                     />

                     <div class="font-weight-bold mt-5">Tên</div>

                     <v-text-field
                        counter="50"
                        v-model="username"
                        v-bind="usernameProps"
                        placeholder="Tên"
                        type="text"
                        color="primary"
                        variant="outlined"
                        base-color="primary"
                     />

                     <div class="font-weight-bold mt-5">Mật khẩu</div>

                     <v-text-field
                        v-model="password"
                        v-bind="passwordProps"
                        :type="showPassword ? 'text' : 'password'"
                        hint="Mật khẩu có ít nhất 8 kí tự"
                        placeholder="Nhập mật khẩu"
                        counter
                        color="primary"
                        variant="outlined"
                        base-color="primary"
                     >
                        <template v-slot:append-inner>
                           <v-btn
                              variant="text"
                              :icon="showPassword ? mdiEye : mdiEyeOff"
                              @click="showPassword = !showPassword"
                           ></v-btn>
                        </template>
                     </v-text-field>

                     <div class="font-weight-bold mt-5">Nhập lại mật khẩu</div>

                     <v-text-field
                        v-model="passwordConfirmation"
                        v-bind="passwordConfirmationProps"
                        :type="showPasswordConfirmation ? 'text' : 'password'"
                        placeholder="Nhập lại mật khẩu"
                        counter
                        color="primary"
                        variant="outlined"
                        base-color="primary"
                     >
                        <template v-slot:append-inner>
                           <v-btn
                              variant="text"
                              :icon="
                                 showPasswordConfirmation ? mdiEye : mdiEyeOff
                              "
                              @click="
                                 showPasswordConfirmation =
                                    !showPasswordConfirmation
                              "
                           ></v-btn>
                        </template>
                     </v-text-field>
                  </v-form>
               </v-card-text>

               <v-card-item class="pa-4">
                  <v-btn
                     color="primary"
                     block
                     height="48"
                     rounded="lg"
                     @click="onSubmit"
                     >Tạo tài khoản mới</v-btn
                  >

                  <div class="flex-center font-weight-bold">
                     <span class="ma-2 me-1"> Đã có tài khoản? </span>
                     <router-link
                        class="text-primary ma-2 ms-1"
                        :to="{
                           name: 'loginPage',
                        }"
                        >Đăng nhập</router-link
                     >
                  </div>
               </v-card-item>
            </v-card>
         </v-col>
      </v-row>

      <v-dialog
         v-model="signUpDone"
         width="auto"
      >
         <v-card
            class=""
            rounded="lg"
         >
            <v-card-item class="pa-4">
               <template v-slot:append>
                  <v-icon
                     :icon="mdiClose"
                     @click="signUpDone = !signUpDone"
                  ></v-icon>
               </template>
            </v-card-item>
            <v-card-text class="flex-center flex-column px-8">
               <v-progress-circular
                  :model-value="loadingValue"
                  :rotate="360"
                  :size="120"
                  :width="7"
                  color="success"
               >
                  <v-btn
                     style="font-size: 3rem"
                     :icon="mdiCheck"
                     color="success"
                     size="90"
                  ></v-btn>
               </v-progress-circular>

               <h3 class="mt-8 text-uppercase text-primary">
                  Tạo tài khoản thành công
               </h3>
            </v-card-text>
            <v-card-item class="pa-8 pt-5">
               <v-btn
                  color="primary"
                  flat
                  block
                  :to="{
                     name: 'loginPage',
                  }"
                  >ĐĂNG NHẬP NGAY</v-btn
               >
               <v-btn
                  class="mt-4"
                  color="primary"
                  variant="outlined"
                  block
                  :to="{
                     name: 'userHomePage',
                  }"
                  >QUAY VỀ TRANG CHỦ</v-btn
               >
            </v-card-item>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { ref } from 'vue';
   import { mdiCheck, mdiClose, mdiEye, mdiEyeOff } from '@mdi/js';
   import UserService from '~/services/UserService';
   import { onBeforeUnmount } from 'vue';
   import { onMounted } from 'vue';
   import { useCurrentPageStore } from '~/stores';

   const currentPageStore = useCurrentPageStore();
   currentPageStore.setCurrentPage('signup');
   const schema = yup.object().shape({
      userId: yup
         .string()
         .required('Mã số sinh viên không thể để trống')
         .max(8, 'Mã số sinh viên tối đa 8 kí tự')
         .matches(/^[B][0-9]{7}$/, 'Mã số sinh viên không đúng định dạng'),

      username: yup
         .string()
         .required('Tên không thể để trống')
         .max(50, 'Tên dài tối đa 50 kí tự'),

      password: yup
         .string()
         .required('Mật khẩu không thể để trống')
         .min(8, 'Mật khẩu phải có ít nhất 8 kí tự')
         .max(255, 'Mật khẩu dài tối đa 255 kí tự'),

      passwordConfirmation: yup
         .string()
         .required('Mật khẩu không thể để trống')
         .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
   });

   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
   });
   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });
   const [userId, userIdProps] = defineField('userId', vuetifyConfig);
   const [username, usernameProps] = defineField('username', vuetifyConfig);
   const [password, passwordProps] = defineField('password', vuetifyConfig);
   const [passwordConfirmation, passwordConfirmationProps] = defineField(
      'passwordConfirmation',
      vuetifyConfig
   );
   const showPassword = ref(false);
   const showPasswordConfirmation = ref(false);
   const signUpDone = ref(false);
   const onSubmit = handleSubmit(async (values) => {
      try {
         const { passwordConfirmation, ...dataSubmited } = values;
         console.log(dataSubmited);
         await UserService.create(dataSubmited);
         signUpDone.value = true;
      } catch (error) {
         console.log(error);
         signUpDone.value = true;
      }
   });
   const loadingInterval = ref({});
   const loadingValue = ref(0);

   onBeforeUnmount(() => {
      clearInterval(loadingInterval.value);
   });

   onMounted(() => {
      loadingInterval.value = setInterval(() => {
         loadingValue.value += 5;
      }, 10);
   });
</script>

<style scoped>
   @import '~/assets/css/SignUp.css';
</style>
