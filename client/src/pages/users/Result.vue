<template>
   <search-bar></search-bar>
   <book-list :section="'Kết quả'" :books="books"></book-list>
</template>

<script setup>
import SearchBar from '~/components/user/SearchBar.vue';
import BookList from '~/components/user/BookList.vue';
import BookService from '~/services/BookService';
import { useSearchFilterStore } from '~/stores';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const searchFilter = {
   searchText: route.query.searchText,
   filter: route.query.filter,
};
const books = ref(null);
const getBooksByFilter = async () => {
   try {
      books.value = await BookService.findByFilter(searchFilter);
   } catch (error) {
      console.log(error);
   }
};
const searchFilterStore = useSearchFilterStore();
const { a } = storeToRefs(searchFilterStore);

onMounted(() => getBooksByFilter());
</script>
