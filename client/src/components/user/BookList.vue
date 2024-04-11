<template>
   <v-sheet class="bg-background">
      <v-row class="sort-bar pa-4 text-primary">
         <v-col
            cols="12"
            sm="6"
            md="auto"
            class="d-flex align-center pb-0 pb-sm-3 font-weight-bold"
         >
            <p>Sắp xếp theo</p>
         </v-col>
         <v-col>
            <v-select
               v-model="sortBySelected"
               :items="BOOK_SORT_BY"
               item-title="text"
               item-value="value"
               :hide-details="true"
               variant="outlined"
               color="primary"
               base-color="primary"
            ></v-select>
         </v-col>
         <v-col
            cols="12"
            sm="6"
            md="auto"
            class="d-flex align-center pb-0 pb-sm-3 font-weight-bold"
         >
            <p>Thứ tự</p>
         </v-col>
         <v-col>
            <v-select
               v-model="sortTypeSelected"
               :items="SORT_TYPE"
               item-title="text"
               item-value="value"
               :hide-details="true"
               variant="outlined"
               color="primary"
               base-color="primary"
            ></v-select>
         </v-col>

         <v-col
            cols="12"
            sm="6"
            md="auto"
            class="d-flex align-center pb-0 pb-sm-3 font-weight-bold"
         >
            <p>Số lượng hiển thị mỗi trang</p>
         </v-col>
         <v-col>
            <v-select
               v-if="hasPagination"
               v-model="documentsPerPageSelected"
               :items="documentsPerPage"
               return-object
               single-line
               :hide-details="true"
               variant="outlined"
               color="primary"
               base-color="primary"
            ></v-select>
         </v-col>
      </v-row>

      <v-list class="bg-background">
         <slot name="result-heading"></slot>
         <div
            class="text-center pa-4 text-primary"
            v-if="hasPagination && books && books.length > 0"
         >
            <v-pagination
               v-model="currentPage"
               :length="totalPages"
               :total-visible="5"
               :next-icon="mdiMenuRight"
               :prev-icon="mdiMenuLeft"
            ></v-pagination>
         </div>
         <div style="position: relative">
            <slot></slot>
            <v-list-item v-for="book in booksRendering">
               <v-card
                  variant="outlined"
                  color="primary"
                  rounded="lg"
                  class="bg-surface"
                  @click="goToBookDetailsPage(book)"
               >
                  <template v-slot:prepend>
                     <v-icon
                        :icon="mdiBook"
                        size="x-small"
                     ></v-icon>
                  </template>
                  <template v-slot:title>
                     <h6 class="font-weight-black text-uppercase text-grey">
                        {{ book.type }}
                     </h6>
                  </template>

                  <v-card-text class="d-flex align-center">
                     <div class="book-item-img">
                        <img
                           src="../../assets/images/bookAlterThumbnail.png"
                           alt=""
                        />
                     </div>

                     <div
                        class="book-item-details text-black font-weight-regular"
                     >
                        <h2
                           class="font-weight-black text-primary"
                           style="line-height: 1.2"
                        >
                           {{ book.title }}
                        </h2>
                        <h3 class="font-weight-black">
                           Tác giả: {{ book.author }}
                        </h3>
                        <p>Mã số trên kệ: {{ book.bookId }}</p>
                        <p>Nhà xuất bản: {{ book.publisher }}</p>
                        <p>Năm xuất bản: {{ book.publishYear }}</p>
                        <p>Chủ đề: {{ book.topic }}</p>
                     </div>
                  </v-card-text>
               </v-card>
            </v-list-item>

            <v-list-item
               v-if="books && books.length === 0"
               class="text-center text-primary"
               min-height="100"
            >
               <p>Không tìm thấy kết quả phù hợp</p>
            </v-list-item>
         </div>

         <div
            class="text-center pa-4 text-primary"
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
      </v-list>
   </v-sheet>
</template>

<script setup>
   import { mdiBook } from '@mdi/js';
   import { useRoute, useRouter } from 'vue-router';
   import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
   import { ref, watch } from 'vue';
   import { onMounted } from 'vue';
   import { BOOK_SORT_BY, SORT_TYPE } from '~/utils/constants';
   import { sortAscending, sortDescending } from '~/utils/sort';

   const props = defineProps({
      section: String,
      books: Array,
      hasPagination: {
         type: Boolean,
         default: false,
      },
   });
   const router = useRouter();

   const sortBySelected = ref(BOOK_SORT_BY[0].value);
   const sortTypeSelected = ref(SORT_TYPE[0].value);
   const sortBooks = () => {
      if (sortTypeSelected.value === 1) {
         sortAscending(props.books, sortBySelected.value);
      } else sortDescending(props.books, sortBySelected.value);
      renderBooks();
   };

   watch([sortBySelected, sortTypeSelected], () => {
      sortBooks();
   });

   const documentsPerPage = [10, 25, 50];
   const currentPage = ref(1);
   const documentsPerPageSelected = ref(documentsPerPage[0]);
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

   watch(
      () => props.books,
      () => {
         console.log(123);
         sortBooks();
      }
   );

   watch([() => props.books, documentsPerPageSelected], () => {
      currentPage.value = 1;
   });

   watch([() => props.books, currentPage, documentsPerPageSelected], () => {
      renderBooks();
      sortBooks();
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
