<template>
   <v-sheet class="bg-background">
      <div class="px-4 pt-4">
         <h2 class="text-primary text-uppercase font-weight-black">
            {{ props.section }}
         </h2>
      </div>

      <v-container fluid>
         <v-row>
            <v-col
               cols="12"
               sm="6"
               md="3"
               lg="2"
               xl="2"
               v-for="book in booksRendering"
            >
               <v-card @click="goToBookDetailsPage(book)">
                  <v-img
                     src="/src/assets/images/bookAlterThumbnail.png"
                     cover
                     :aspect-ratio="1"
                     color="indigo-lighten-4"
                  ></v-img>

                  <v-card-item class="px-6 pt-4 pb-6">
                     <v-card-subtitle
                        class="d-flex align-center pb-3"
                        style="font-size: 13px; opacity: 1"
                     >
                        <v-icon
                           :icon="mdiBook"
                           color="primary"
                        ></v-icon>

                        <span
                           class="ms-1 text-uppercase font-weight-bold text-grey"
                           >{{ book.type }}</span
                        >
                     </v-card-subtitle>

                     <v-card-title
                        style="
                           line-height: 1.2;
                           font-size: 1rem;
                           font-weight: 700;
                           text-align: justify;
                        "
                        class="text-primary"
                     >
                        {{ book.title }}
                     </v-card-title>

                     <v-card-subtitle
                        class="py-2"
                        style="font-size: 13px"
                        >{{ book.author }}</v-card-subtitle
                     >

                     <v-btn
                        style="
                           border: 1px dashed rgb(var(--v-theme-primary));
                           text-transform: capitalize;
                           letter-spacing: normal;
                        "
                        :ripple="false"
                        variant="tonal"
                        color="primary"
                        rounded="lg"
                        size="small"
                     >
                        {{ book.topic }}
                     </v-btn>
                  </v-card-item>
               </v-card>
            </v-col>
         </v-row>
      </v-container>
   </v-sheet>

   <v-select
      v-if="hasPagination"
      v-model="documentsPerPageSelected"
      :items="documentsPerPage"
      label="Select"
      return-object
      single-line
   ></v-select>

   <div
      class="text-center"
      v-if="hasPagination"
   >
      <v-pagination
         v-model="currentPage"
         :length="totalPages"
         :total-visible="5"
         :next-icon="mdiMenuRight"
         :prev-icon="mdiMenuLeft"
      ></v-pagination>
   </div>
</template>

<script setup>
   import { mdiBook } from '@mdi/js';
   import { useRoute, useRouter } from 'vue-router';
   import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
   import { ref, watch } from 'vue';
   import { onMounted } from 'vue';

   const props = defineProps({
      section: String,
      books: Array,
      hasPagination: {
         type: Boolean,
         default: false,
      },
      documentsPerPage: Number,
   });

   const emits = defineEmits(['bookActive']);

   const router = useRouter();
   const route = useRoute();
   const pushPageToQuery = (page) => {
      router.replace({
         query: {
            ...route.query,
            page: page,
         },
      });
   };

   const documentsPerPage = [10, 25, 50];
   const currentPage = ref(1);
   const documentsPerPageSelected = ref(props.documentsPerPage);
   const documentsRange = ref();
   const totalPages = ref(1);
   const booksRendering = ref([]);
   const renderBooks = () => {
      totalPages.value = Math.ceil(
         props.books.length / documentsPerPageSelected.value
      );

      documentsRange.value = {
         startIdx: (currentPage.value - 1) * documentsPerPageSelected.value,
         endIdx: currentPage.value * documentsPerPageSelected.value - 1,
      };

      booksRendering.value = props.books.slice(
         documentsRange.value.startIdx,
         documentsRange.value.endIdx + 1
      );
   };

   watch([() => props.books, documentsPerPageSelected], () => {
      currentPage.value = 1;
   });

   watch([() => props.books, currentPage, documentsPerPageSelected], () => {
      renderBooks();
   });

   watch(currentPage, () => {
      pushPageToQuery(currentPage.value);
   });

   const goToBookDetailsPage = (book) => {
      router.push({
         name: 'bookDetailsPage',
         params: {
            slug: book.slug,
            id: book._id,
         },
      });
   };

   onMounted(() => {
      renderBooks();
   });
</script>

<style scoped>
   @import '~/assets/css/BookList.css';
</style>
