<template>
   <h1>This is help center page</h1>
</template>

<script setup>
   import { useCurrentPageStore } from '~/stores';

   const currentPageStore = useCurrentPageStore();
   currentPageStore.setCurrentPage('help-center');
</script>
