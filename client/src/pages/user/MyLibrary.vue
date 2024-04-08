<template>
   <h1>This is my library page</h1>
</template>

<script setup>
import { useCurrentPageStore } from '~/stores';

const currentPageStore = useCurrentPageStore();
currentPageStore.setCurrentPage('library');
</script>
