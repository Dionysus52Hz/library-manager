<template>
   <v-container class="page">
      <v-row>
         <v-col class="pe-0">
            <v-card class="rounded-0 rounded-s-lg">
               <v-card-item class="py-4">
                  <v-card-title class="font-weight-bold"
                     >ĐĂNG NHẬP
                  </v-card-title>
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
                        v-bind="userIdProps"
                        placeholder="Mã số sinh viên"
                        hide-details
                        variant="outlined"
                        color="primary"
                     />

                     <div class="font-weight-bold mt-5">Mật khẩu</div>

                     <v-text-field
                        v-model="password"
                        v-bind="passwordProps"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Nhập mật khẩu"
                        hint="abc"
                        color="primary"
                        variant="outlined"
                        base-color="primary"
                     >
                        <template v-slot:append-inner>
                           <v-btn
                              variant="text"
                              :icon="showPassword ? mdiEye : mdiEyeOff"
                              @click.stop.prevent="showPassword = !showPassword"
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
                     :disabled="inputsAreEmpty ? true : false"
                     @click="onSubmit"
                     >Đăng nhập</v-btn
                  >
                  {{ userId }}

                  <div class="flex-center font-weight-bold">
                     <span class="ma-2 me-1"> Chưa có tài khoản? </span>
                     <router-link
                        class="text-primary ma-2 ms-1"
                        :to="{
                           name: 'signUpPage',
                        }"
                        >Đăng ký</router-link
                     >
                  </div>
               </v-card-item>
            </v-card>
         </v-col>

         <v-col class="ps-0 v-col-6 d-none d-sm-block">
            <v-card
               color="indigo-lighten-4"
               class="login-form-bg rounded-0 rounded-e-lg"
            ></v-card>
         </v-col>
      </v-row>

      <v-dialog
         v-model="loginDone"
         width="auto"
         max-height="540"
      >
         <v-card
            class=""
            rounded="lg"
         >
            <v-card-item class="pa-4">
               <template v-slot:append>
                  <v-icon
                     :icon="mdiClose"
                     @click="loginDone = !loginDone"
                  ></v-icon>
               </template>
            </v-card-item>
            <v-card-text class="flex-center flex-column px-8">
               <v-progress-circular
                  :model-value="loadingValue"
                  :rotate="360"
                  :size="120"
                  :width="4"
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
                  Đăng nhập thành công
               </h3>
            </v-card-text>
            <v-card-item class="pa-8 pt-5">
               <v-btn
                  color="primary"
                  flat
                  block
                  :to="{
                     name: 'userHomePage',
                  }"
                  >TIẾP TỤC</v-btn
               >
            </v-card-item>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script setup>
   import { useForm } from 'vee-validate';
   import { mdiCheck, mdiClose, mdiEye, mdiEyeOff } from '@mdi/js';
   import UserService from '~/services/UserService';
   import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
   import { useCurrentPageStore, useLoginStore } from '~/stores';

   const currentPageStore = useCurrentPageStore();
   currentPageStore.setCurrentPage('login');

   const { defineField, handleSubmit } = useForm();
   const [userId, userIdProps] = defineField('userId');
   const [password, passwordProps] = defineField('password');
   const showPassword = ref(false);
   const loginDone = ref(false);
   const loginStore = useLoginStore();
   const inputsAreEmpty = ref(true);
   watch([userId, password], () => {
      if (
         userId.value !== '' &&
         password.value !== '' &&
         typeof userId.value === 'string' &&
         typeof password.value === 'string'
      ) {
         inputsAreEmpty.value = false;
      } else inputsAreEmpty.value = true;
   });
   const onSubmit = handleSubmit(async (values) => {
      try {
         const user = await UserService.login(values);
         console.log(user);
         let state = {
            isLoggedIn: true,
            owner: values.userId,
            role: 'user',
         };
         loginStore.setLoginState(state);
      } catch (error) {
         console.log(error);
         // loginDone.value = true;
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
   @import '~/assets/css/Login.css';
</style>
