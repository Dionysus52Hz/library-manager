<template>
   <v-layout>
      <Header></Header>

      <v-main>
         <router-view></router-view>
         <router-view name="BookDetails"></router-view>
      </v-main>
   </v-layout>
</template>

<script setup>
   import Header from '~/components/user/Header.vue';
   import { useCurrentPageStore } from '~/stores';
   const currentPageStore = useCurrentPageStore();
   console.log(currentPageStore.currentPage);
</script>
