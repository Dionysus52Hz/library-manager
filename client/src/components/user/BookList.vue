<template>
   <v-sheet class="recommend-for-you px-6 bg-background">
      <v-list class="bg-background">
         <v-list-subheader>
            <h3 class="text-primary text-uppercase font-weight-black">
               {{ props.section }}
            </h3>
         </v-list-subheader>

         <v-list-item-action class="flex-center">
            <slot></slot>
         </v-list-item-action>

         <v-list-item v-for="book in books">
            <v-card
               variant="outlined"
               color="primary"
               rounded="lg"
               class="bg-surface"
            >
               <template v-slot:prepend>
                  <v-icon :icon="mdiBook" size="x-small"></v-icon>
               </template>
               <template v-slot:title>
                  <h6 class="font-weight-black text-uppercase text-grey">
                     Giáo trình
                  </h6>
               </template>

               <v-card-text class="d-flex">
                  <img src="" alt="" class="book-item-img" />
                  <div class="book-item-details text-black font-weight-regular">
                     <h2 class="font-weight-black text-primary">
                        {{ book.title }}
                     </h2>
                     <h3 class="font-weight-black">
                        Tác giả: {{ book.author }}
                     </h3>
                     <p>Nhà xuất bản: {{ book.publisher }}</p>
                     <p>Năm xuất bản: {{ book.publishedAt }}</p>
                     <p>Chủ đề: {{ book.topic }}</p>
                  </div>
               </v-card-text>
            </v-card>
         </v-list-item>

         <v-list-item
            v-if="books && books.length === 0"
            title="Không tìm thấy kết quả phù hợp"
         ></v-list-item>
         <p></p>
      </v-list>
   </v-sheet>
</template>

<script setup>
import { mdiBook } from '@mdi/js';

const props = defineProps({
   section: String,
   books: Array,
});
</script>

<style scoped>
@import '~/assets/css/BookList.css';
</style>
