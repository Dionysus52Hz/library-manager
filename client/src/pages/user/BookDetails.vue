<template>
   <v-container
      class="page"
      fluid
      v-if="book"
   >
      <v-row>
         <v-col
            cols="12"
            class="px-0"
            style="
               position: absolute;
               width: calc(100% - 24px);
               top: 0;
               left: 0;
               right: 0;
               margin: 0 auto;
            "
         >
            <v-card
               color="indigo-darken-1"
               class="pa-4"
               rounded="lg"
            >
               <v-row>
                  <v-col
                     cols="3"
                     class="pe-2"
                  ></v-col>

                  <v-col
                     cols="8"
                     class="ps-2"
                  >
                     <h4>{{ book.title }}</h4>
                     <p
                        style="
                           font-size: 13px;
                           padding: 8px 0;
                           font-weight: 400;
                           opacity: 0.8;
                        "
                     >
                        Tác giả: {{ book.author }}
                     </p>
                     <v-btn
                        style="
                           border: 1px dashed #fff;
                           text-transform: capitalize;
                           letter-spacing: normal;
                        "
                        :ripple="false"
                        variant="tonal"
                        rounded="md"
                        size="x-small"
                     >
                        {{ book.topic }}
                     </v-btn>
                  </v-col>

                  <v-col cols="1">
                     <v-icon :icon="mdiBookmark"></v-icon>
                  </v-col>
               </v-row>
            </v-card>
         </v-col>

         <v-col
            cols="3"
            class="pa-5 pe-2"
         >
            <v-img
               src="/src/assets/images/bookAlterThumbnail.png"
               :aspect-ratio="2 / 3"
               cover
               rounded="lg"
               color="indigo-lighten-4"
            >
            </v-img>
            <v-btn
               block
               color="primary"
               size="x-small"
               class="mt-4"
               height="28"
               >Đăng ký mượn</v-btn
            >
            <v-btn
               block
               size="x-small"
               class="mt-3"
               height="28"
               variant="outlined"
               color="primary"
               >Thêm vào yêu thích</v-btn
            >
         </v-col>

         <v-col
            cols="9"
            class="pa-5 ps-2"
         >
            <v-row
               style="padding-top: 140px"
               class="text-primary"
            >
               <v-col cols="7">
                  <h5 class="pb-1">Mô tả</h5>
                  <p>
                     Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                     Nihil quasi numquam architecto vel officia quae nostrum
                     cumque doloribus tenetur eligendi magnam nam, recusandae
                     vero minus rem, consectetur molestiae velit id?
                  </p>
               </v-col>
               <v-col cols="5">
                  <v-row class="pt-6">
                     <v-col cols="6">
                        <h6>Mã số trên kệ</h6>
                        <p>{{ book.bookId }}</p>
                     </v-col>
                     <v-col cols="6">
                        <h6>Phân loại</h6>
                        <p>{{ book.type }}</p>
                     </v-col>
                     <v-col cols="6">
                        <h6>Nhà xuất bản</h6>
                        <p>{{ book.publisher }}</p>
                     </v-col>
                     <v-col cols="6">
                        <h6>Năm xuất bản</h6>
                        <p>{{ book.publishYear }}</p>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
   import { mdiBookmark } from '@mdi/js';
   import BookService from '~/services/BookService';
   import { onBeforeMount, ref, watch } from 'vue';
   import { useRoute } from 'vue-router';

   const route = useRoute();
   const book = ref(null);
   const getBook = async () => {
      try {
         book.value = await BookService.findOneById(route.params.id);
      } catch (error) {
         console.log(error);
      }
   };

   onBeforeMount(async () => {
      await getBook();
   });
</script>

<style scoped>
   p {
      font-size: 12px;
   }
</style>
