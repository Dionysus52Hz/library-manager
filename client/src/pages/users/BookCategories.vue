<template>
   <v-container class="page">
      <h1>This is book categories page</h1>
   </v-container>
</template>

<script setup>
import { useCurrentPageStore } from '~/stores';

const currentPageStore = useCurrentPageStore();

currentPageStore.setCurrentPage('book');
</script>
