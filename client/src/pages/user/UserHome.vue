<template>
   <img
      class="user-home-bg"
      src="../../assets/images/userHomeBg.png"
      alt=""
   />
   <v-container class="page">
      <v-row class="introduce align-center">
         <v-col
            cols="12"
            md="6"
         >
            <v-row>
               <v-col cols="12">
                  <h1 class="main-title text-primary">
                     Education is the premise of progress
                  </h1>
               </v-col>

               <v-col cols="12">
                  <search-bar
                     @submit-search="submitSearch"
                     :filters="SEARCH_FILTERS_FOR_USER"
                  ></search-bar>
               </v-col>

               <v-col class="text-right pt-0">
                  <v-btn
                     variant="text"
                     color="primary"
                     size="x-large"
                     class="font-weight-bold"
                     @click="goToAdvancedSearch"
                  >
                     Tìm kiếm nâng cao
                  </v-btn>
               </v-col>

               <v-col cols="12">
                  <v-row class="counter-book text-primary">
                     <v-col class="d-flex flex-column align-center">
                        <span>500+</span>
                        <span>đầu sách</span>
                     </v-col>
                     <v-col class="d-flex flex-column align-center">
                        <span>200+</span>
                        <span>luận văn, luận án</span>
                     </v-col>
                     <v-col class="d-flex flex-column align-center">
                        <span>50+</span>
                        <span>nghiên cứu khoa học</span>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-col>
         <v-col
            cols="12"
            md="6"
            class="pa-0 d-none d-md-block"
         >
            <img
               src="../../assets/images/userHomeBgBook.png"
               alt=""
               class="introduce-image"
            />
         </v-col>
      </v-row>

      <v-row class="section">
         <v-col cols="12">
            <book-grid
               :section="'Sách mới cập nhật'"
               :books="newestBooks"
               :documents-per-page="12"
            ></book-grid>
         </v-col>

         <v-col cols="12">
            <book-grid
               :section="'Danh mục phân loại'"
               :books="[]"
            >
               <v-tabs
                  v-model="topicSelected"
                  class="topic-select"
                  show-arrows
                  mandatory
                  center-active
               >
                  <v-tab
                     v-for="category in BOOK_TOPICS"
                     :hide-slider="true"
                     :ripple="false"
                     >{{ category }}</v-tab
                  >
               </v-tabs>
            </book-grid>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
   import SearchBar from '~/components/user/SearchBar.vue';
   import BookGrid from '~/components/user/BookGrid.vue';
   import { useCurrentPageStore } from '~/stores';
   import { useSearchFilterForUserStore } from '~/stores';
   import {
      SEARCH_FILTERS_FOR_USER,
      BOOK_TOPICS,
      BOOK_TYPES,
   } from '~/utils/constants';
   import { onActivated, onBeforeMount, ref } from 'vue';
   import { onBeforeRouteLeave, useRouter } from 'vue-router';
   import { storeToRefs } from 'pinia';
   import BookService from '~/services/BookService';

   const currentPageStore = useCurrentPageStore();
   const searchFilterStore = useSearchFilterForUserStore();
   const { searchFilter } = storeToRefs(searchFilterStore);
   searchFilterStore.setSearchFilter({
      searchText: '',
      filterSelected: SEARCH_FILTERS_FOR_USER[0],
   });

   const topicSelected = ref(0);
   const router = useRouter();
   const goToResultPage = () => {
      router.push({
         name: 'resultPage',
         params: {
            filter: searchFilter.value.filterSelected.filter,
         },
         query: {
            searchText: searchFilter.value.searchText,
         },
      });
   };

   const submitSearch = () => {
      searchFilterStore.setSearchFilter(searchFilter.value);
      goToResultPage();
   };

   const goToAdvancedSearch = () => {
      router.push({
         name: 'resultPage',
         params: {
            filter: 'advanced-search',
         },
      });
   };

   const newestBooks = ref([]);
   const getNewestBooks = async () => {
      try {
         newestBooks.value = await BookService.getAll();

         newestBooks.value = newestBooks.value
            .sort((bookA, bookB) => bookB.createdAt - bookA.createdAt)
            .slice(0, 12);
      } catch (error) {
         console.log(error);
      }
   };

   onBeforeMount(async () => {
      await getNewestBooks();
   });

   onBeforeRouteLeave(() => {
      console.log('leave from user home');
   });

   onActivated(() => {
      currentPageStore.setCurrentPage('home');
   });
</script>
<style scoped>
   @import '~/assets/css/UserHome.css';
</style>
