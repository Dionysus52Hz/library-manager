<template>
   <v-sheet class="flex-center search-bar text-primary">
      <v-select
         class="search-filter"
         v-model="searchFilter.filterSelected"
         :items="filters"
         item-title="text"
         item-value="value"
         return-object
         single-line
         variant="outlined"
         density="comfortable"
         flat
         hide-details="auto"
         color="primary"
         base-color="primary"
      ></v-select>

      <v-text-field
         clearable
         variant="solo"
         density="comfortable"
         flat
         placeholder="Nhập từ khoá"
         hide-details="auto"
         class="text-primary"
         v-model.trim="searchFilter.searchText"
         @keyup.enter="submitSearch"
      >
      </v-text-field>
      <v-btn
         flat
         color="primary"
         class="search-btn"
         @click="submitSearch"
         :disabled="searchFilter.searchText === ''"
      >
         <v-icon
            :icon="mdiMagnify"
            size="x-large"
         ></v-icon>
      </v-btn>
   </v-sheet>
</template>

<script setup>
   import { mdiMagnify } from '@mdi/js';
   import { storeToRefs } from 'pinia';
   import { useSearchFilterForUserStore } from '~/stores';

   const props = defineProps({
      filters: Array,
   });
   const emit = defineEmits(['submit-search']);

   const searchFilterStore = useSearchFilterForUserStore();
   const { searchFilter } = storeToRefs(searchFilterStore);

   const submitSearch = () => {
      if (searchFilter.value.searchText !== '') {
         emit('submit-search');
      }
   };
</script>
