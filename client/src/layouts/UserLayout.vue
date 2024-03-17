<template>
   <v-layout>
      <Header></Header>

      <v-main>
         <router-view></router-view>
      </v-main>
   </v-layout>
</template>

<script setup>
import Header from '~/components/user/Header.vue';
</script>
