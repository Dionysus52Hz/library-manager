<template>
   <v-sheet class="flex-center search-bar text-primary">
      <v-select
         class="search-filter"
         v-model="filterSelected"
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
         v-model="searchText"
      >
      </v-text-field>
      <v-btn flat color="primary" class="search-btn">
         <v-icon
            :icon="mdiMagnify"
            size="x-large"
            @click="submitSearch"
         ></v-icon>
      </v-btn>
   </v-sheet>
</template>

<script setup>
import { mdiMagnify } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchFilterStore } from '~/stores';

const searchFilterStore = useSearchFilterStore();
const filters = [
   {
      filter: 'keyword',
      text: 'Từ khoá bất kỳ',
   },
   {
      filter: 'title',
      text: 'Tựa đề',
   },
   {
      filter: 'author',
      text: 'Tác giả',
   },
   {
      filter: 'publishedYear',
      text: 'Năm xuất bản',
   },
];

const filterSelected = ref({
   filter: 'keyword',
   text: 'Từ khoá bất kỳ',
});
const searchText = ref('');
const searchFilter = ref({});

watch([searchText, filterSelected], ([newSearchText, newFilterSelected]) => {
   searchFilter.value = {
      searchText: newSearchText,
      filter: newFilterSelected,
   };
});

const router = useRouter();
const goToResultPage = () => {
   router.push({
      name: 'resultPage',
      query: {
         searchText: searchText.value,
         filter: filterSelected.value.filter,
      },
   });
};

const submitSearch = () => {
   goToResultPage();
   searchFilterStore.setSearchFilter(searchFilter.value);
};
</script>
