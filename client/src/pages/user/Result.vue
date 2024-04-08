<template>
   <v-container class="page">
      <v-row>
         <v-col
            cols="12"
            class="pa-6 pb-3"
         >
            <v-card rounded="lg">
               <v-tabs
                  v-model="searchTab"
                  color="primary"
               >
                  <v-tab
                     value="basic-search"
                     @click="goToBasicSearch"
                     >Tìm kiếm cơ bản</v-tab
                  >
                  <v-tab
                     value="advanced-search"
                     @click="goToAdvancedSearch"
                     >Tìm kiếm nâng cao</v-tab
                  >
               </v-tabs>

               <v-window v-model="searchTab">
                  <v-window-item value="basic-search">
                     <v-container fluid>
                        <search-bar
                           :filters="SEARCH_FILTERS_FOR_USER"
                           @submit-search="submitBasicSearch"
                        ></search-bar>
                     </v-container>
                  </v-window-item>
                  <v-window-item value="advanced-search">
                     <advanced-search
                        @submit-search="submitAdvancedSearch"
                     ></advanced-search>
                  </v-window-item>
               </v-window>
            </v-card>
         </v-col>

         <v-col
            cols="12"
            class="pa-6 pt-3"
         >
            <book-list
               :has-pagination="true"
               :section="searchFilter.searchText"
               :books="books"
               @book-active="getBookActive"
            >
               <div
                  class="loading-circular"
                  v-if="booksChange"
               >
                  <v-progress-circular
                     :size="70"
                     :width="7"
                     color="primary"
                     indeterminate
                  >
                  </v-progress-circular>
               </div>
            </book-list>
         </v-col>
      </v-row>

      <book-details
         :book="bookActive"
         ref="BookDetailsRef"
      ></book-details>
   </v-container>
</template>

<script setup>
   import BookService from '~/services/BookService';
   import SearchBar from '~/components/user/SearchBar.vue';
   import BookList from '~/components/user/BookList.vue';
   import BookDetails from '~/pages/user/BookDetails.vue';
   import AdvancedSearch from '~/components/user/AdvancedSearch.vue';
   import { SEARCH_FILTERS_FOR_USER } from '~/utils/constants';
   import { useSearchFilterForUserStore, useCurrentPageStore } from '~/stores';
   import { ref, onBeforeMount } from 'vue';
   import { useRouter, onBeforeRouteUpdate } from 'vue-router';
   import { onMounted } from 'vue';

   const currentPageStore = useCurrentPageStore();
   currentPageStore.setCurrentPage('result');
   const searchFilterStore = useSearchFilterForUserStore();
   const searchFilter = searchFilterStore.searchFilter;

   const searchTab = ref(null);
   const booksChange = ref(true);
   const books = ref([]);
   const getBooksByFilter = async () => {
      try {
         booksChange.value = true;
         books.value = [];
         books.value = await BookService.findByFilter(searchFilter);
         booksChange.value = false;
      } catch (error) {
         console.log(error);
      }
   };

   const router = useRouter();
   const goToBasicSearch = () => {
      router.replace({
         params: { filter: 'keyword' },
         query: {
            searchText: '',
         },
      });
   };
   const goToAdvancedSearch = () => {
      router.replace({
         path: 'advanced-search',
      });
   };
   const changeRouteBasicSearch = () => {
      router.push({
         params: { filter: searchFilter.filterSelected.filter },
         query: {
            searchText: searchFilter.searchText,
         },
      });
   };

   const submitBasicSearch = () => {
      changeRouteBasicSearch();
   };
   const bookActive = ref(null);
   const BookDetailsRef = ref(null);
   const getBookActive = (book) => {
      bookActive.value = book;
      BookDetailsRef.value.openDialog();
   };

   onBeforeMount(() => {
      getBooksByFilter();
   });

   onBeforeRouteUpdate((to, from) => {
      const currentFilterSelected = SEARCH_FILTERS_FOR_USER.find(
         (filter) => filter.filter === to.params.filter
      );
      searchFilter.searchText = to.query.searchText;
      searchFilter.filterSelected = currentFilterSelected;

      if (to.params.filter === 'advanced-search') {
         books.value = [];
         searchTab.value = 'advanced-search';
      } else if (
         to.query.searchText !== from.query.searchText ||
         to.params.filter !== from.params.filter
      ) {
         searchTab.value = 'basic-search';
         getBooksByFilter();
      }
   });

   const getBooksByCombinationFilters = async (filters) => {
      try {
         booksChange.value = true;
         books.value = [];
         books.value = await BookService.findByCombinationFilters(filters);
         booksChange.value = false;
      } catch (error) {
         console.log(error);
      }
   };

   const submitAdvancedSearch = (filters) => {
      getBooksByCombinationFilters(filters);
   };

   onMounted(() => {
      const currentRouterParam = router.currentRoute.value.params.filter;
      if (currentRouterParam === 'advanced-search') {
         searchTab.value = currentRouterParam;
      }
   });
</script>

<style scoped>
   @import '~/assets/css/Result.css';
</style>
