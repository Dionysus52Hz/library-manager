import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCurrentPageStore = defineStore('current-page', () => {
   const currentPage = ref('');

   function setCurrentPage(page) {
      currentPage.value = page;
   }

   return { currentPage, setCurrentPage };
});

export const useSearchFilterStore = defineStore('search-filter', () => {
   const searchFilters = ref({});

   function setSearchFilter(filter) {
      console.log(filter);
      searchFilters.value = filter;
   }

   return { searchFilters, setSearchFilter };
});
