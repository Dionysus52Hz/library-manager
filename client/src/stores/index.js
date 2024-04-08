import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SEARCH_FILTERS_FOR_USER } from '~/utils/constants';

export const useCurrentPageStore = defineStore('current-page', () => {
   const currentPage = ref('');

   function setCurrentPage(page) {
      currentPage.value = page;
   }

   return { currentPage, setCurrentPage };
});

export const useSearchFilterForUserStore = defineStore(
   'search-filter-for-user',
   () => {
      const searchFilter = ref({});

      function setSearchFilter(filter) {
         searchFilter.value = filter;
      }

      return { searchFilter, setSearchFilter };
   },
   {
      persist: {
         storage: sessionStorage,
      },
   }
);
