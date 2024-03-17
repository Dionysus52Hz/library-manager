<template>
   <v-layout>
      <v-app-bar color="primary" prominent style="position: fixed">
         <a class="ms-4 me-2">
            <v-icon :icon="mdiVuejs" color="white"></v-icon>
         </a>
         <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawerIsOpen = !drawerIsOpen"
         ></v-app-bar-nav-icon>

         <v-spacer></v-spacer>
         <v-btn>
            <v-icon :icon="mdiHome"></v-icon>
         </v-btn>
      </v-app-bar>

      <v-navigation-drawer
         v-model="drawerIsOpen"
         location="left"
         style="position: fixed"
      >
         <v-list density="compact" mandatory>
            <v-list-item
               v-for="(item, index) in items"
               :key="index"
               :value="item"
               color="primary"
               @click="item.direct"
            >
               <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
               </template>

               <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>

      <v-main>
         <router-view></router-view>
      </v-main>
   </v-layout>
</template>

<script setup>
import { mdiHome, mdiBookMultiple, mdiAccount, mdiVuejs } from '@mdi/js';
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';

const { mobile } = useDisplay();
const drawerIsOpen = ref(!mobile.value);

const router = useRouter();

const items = [
   {
      text: 'Trang chủ',
      icon: mdiHome,
      direct: () => {
         router.push({ name: 'adminHomePage' });
      },
   },
   {
      text: 'Quản lí tài liệu',
      icon: mdiBookMultiple,
      direct: () => {
         router.push({ name: 'adminBookManagementPage' });
      },
   },

   {
      text: 'Quản lí người dùng',
      icon: mdiAccount,
      direct: () => {
         router.push({ name: 'adminUserManagementPage' });
      },
   },
];
</script>

<style scoped>
@import '~/assets/css/AdminHome.css';
</style>
