<template>
   <div>
      <v-app-bar
         :color="currentPage === 'home' ? 'transparent' : 'white'"
         prominent
         flat
         height="68"
         style="position: fixed; max-width: 1320px; right: 0; margin: auto"
         :class="{
            'v-app-bar__large-screen': mdAndUp,
         }"
      >
         <!-- Tabs in large screen -->
         <template v-slot:prepend>
            <a class="ms-4 me-2">
               <v-icon :icon="mdiVuejs"></v-icon>
            </a>
            <v-tabs
               v-model="tab"
               align-tabs="center"
               class="d-none d-md-block"
            >
               <v-tab
                  :class="[{ 'text-primary': currentPage === 'home' }, '']"
                  v-for="(page, index) in pages.slice(0, 4)"
                  :value="index"
                  @click="page.direct"
                  >{{ page.text }}</v-tab
               >
            </v-tabs>
         </template>

         <template v-slot:append>
            <v-btn
               @click="goToSignUpPage"
               rounded
               variant="tonal"
               height="32"
               class="me-4 d-none d-md-flex"
               :append-icon="mdiChevronRight"
               :class="[{ 'text-primary': currentPage === 'home' }, '']"
               >Đăng ký</v-btn
            >
            <v-btn
               @click="goToLoginPage"
               rounded
               variant="tonal"
               height="32"
               class="me-4 d-none d-md-flex"
               :append-icon="mdiChevronRight"
               :class="[{ 'text-primary': currentPage === 'home' }, '']"
               >Đăng nhập</v-btn
            >
            <v-app-bar-nav-icon
               variant="text"
               class="d-md-none"
               @click.stop="drawerIsOpen = !drawerIsOpen"
            ></v-app-bar-nav-icon>
         </template>
      </v-app-bar>

      <v-navigation-drawer
         class="d-md-none"
         v-model="drawerIsOpen"
         location="right"
         temporary
      >
         <v-card>
            <v-card-item class="pa-4">
               <v-row>
                  <v-col class="menu-logo">
                     <v-icon :icon="mdiHome"></v-icon>
                  </v-col>

                  <v-spacer></v-spacer>

                  <v-col class="d-flex justify-end">
                     <v-icon
                        :icon="mdiClose"
                        @click.stop="drawerIsOpen = !drawerIsOpen"
                     ></v-icon>
                  </v-col>
               </v-row>
            </v-card-item>

            <v-divider></v-divider>

            <v-list
               density="compact"
               mandatory
               bg-color="#f6f9fb"
            >
               <v-list-item
                  v-for="(page, index) in pages"
                  :key="index"
                  :value="page"
                  @click="page.direct"
                  color="primary"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="page.icon"
                        color="primary"
                     ></v-icon>
                  </template>

                  <v-list-item-title
                     v-text="page.text"
                     class="font-weight-bold"
                  ></v-list-item-title>
               </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-card-actions class="flex-column align-center pa-4">
               <v-btn
                  @click="goToSignUpPage"
                  rounded
                  variant="flat"
                  color="primary"
                  :append-icon="mdiChevronRight"
                  >Đăng ký</v-btn
               >

               <v-btn
                  @click="goToLoginPage"
                  rounded
                  variant="flat"
                  color="primary"
                  :append-icon="mdiChevronRight"
                  class="ma-0 mt-4"
                  >Đăng nhập</v-btn
               >
            </v-card-actions>
         </v-card>
      </v-navigation-drawer>
   </div>
</template>

<script setup>
   import {
      mdiHome,
      mdiBookMultiple,
      mdiVuejs,
      mdiBookshelf,
      mdiHelpBox,
      mdiChevronRight,
      mdiClose,
   } from '@mdi/js';
   import { storeToRefs } from 'pinia';
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';
   import { useDisplay } from 'vuetify/lib/framework.mjs';
   import { useCurrentPageStore } from '~/stores';

   const drawerIsOpen = ref(false);
   const tab = ref(null);
   const { mdAndUp } = useDisplay();
   const router = useRouter();
   const emits = defineEmits(['reload']);
   const pages = [
      {
         text: 'Trang chủ',
         icon: mdiHome,
         direct: () => {
            router.push({ name: 'userHomePage' });
            window.scrollTo({
               top: 0,
               left: 0,
               behavior: 'smooth',
            });
            emits('reload');
         },
      },
      {
         text: 'Danh mục tài liệu',
         icon: mdiBookMultiple,
         direct: () => {
            router.push({
               name: 'bookCategoriesPage',
            });
            window.scrollTo({
               top: 0,
               left: 0,
               behavior: 'smooth',
            });
         },
      },

      {
         text: 'Thư viện của tôi',
         icon: mdiBookshelf,
         direct: () => {
            router.push({ name: 'myLibraryPage' });
         },
      },
      {
         text: 'Trợ giúp',
         icon: mdiHelpBox,
         direct: () => {
            router.push({ name: 'helpCenterPage' });
         },
      },
   ];

   const goToSignUpPage = () => {
      router.push({ name: 'signUpPage' });
   };

   const goToLoginPage = () => {
      router.push({ name: 'loginPage' });
   };

   const currentPageStore = useCurrentPageStore();
   const { currentPage } = storeToRefs(currentPageStore);
</script>

<style scoped>
   @import '~/assets/css/UserHeader.css';
</style>
