<template>
   <v-app-bar
      style="
         max-width: 1320px;
         position: fixed;
         right: 0;
         margin-left: auto;
         margin-right: auto;
      "
      flat
      height="68"
   >
      <v-tabs
         v-model="topicSelected"
         class="topic-select"
         show-arrows
         mandatory
         center-active
      >
         <v-tab
            v-for="topic in BOOK_TOPICS"
            :hide-slider="true"
            :ripple="false"
            >{{ topic }}</v-tab
         >
      </v-tabs>
   </v-app-bar>
   <div
      class="loading-circular"
      v-if="!books"
   >
      <v-progress-circular
         :size="70"
         :width="7"
         color="primary"
         indeterminate
      ></v-progress-circular>
   </div>

   <v-container class="page">
      <v-row class="justify-center">
         <v-col cols="12">
            <book-grid
               v-if="booksByTopic"
               :books="booksByTopic"
               :has-pagination="true"
               :documents-per-page="10"
            ></book-grid>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
   import BookService from '~/services/BookService';
   import BookGrid from '~/components/user/BookGrid.vue';
   import BookDetails from '~/pages/user/BookDetails.vue';
   import { useCurrentPageStore } from '~/stores';
   import { BOOK_TOPICS } from '~/utils/constants';
   import { ref, onBeforeMount, watch } from 'vue';
   import { onBeforeRouteLeave, useRouter } from 'vue-router';
   import { onBeforeUnmount } from 'vue';
   import { onDeactivated } from 'vue';
   import { onActivated } from 'vue';

   const currentPageStore = useCurrentPageStore();

   const topicSelected = ref(0);
   const books = ref();
   const getBooks = async () => {
      books.value = await BookService.getAll();
   };

   const booksByTopic = ref(null);
   const getBooksByTopic = (topic) => {
      booksByTopic.value = books.value.filter((book) => book.topic === topic);
   };

   watch(topicSelected, () => {
      getBooksByTopic(BOOK_TOPICS[topicSelected.value]);
   });

   onBeforeMount(async () => {
      await getBooks();
      getBooksByTopic(BOOK_TOPICS[0]);
   });

   onActivated(() => {
      currentPageStore.setCurrentPage('categories');
   });
</script>

<style scoped>
   @import '~/assets/css/BookCategories.css';
</style>
