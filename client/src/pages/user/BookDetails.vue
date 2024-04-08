<template>
   <v-dialog
      v-model="isOpenDialog"
      max-width="960"
      persistent
      scrollable
   >
      <v-card rounded="lg">
         <v-toolbar>
            <v-container
               class="toolbar"
               fluid
            >
               <v-row class="align-center text-primary">
                  <v-icon
                     :icon="mdiBookOpenPageVariant"
                     size="20"
                     class="ms-4 me-2"
                  ></v-icon>
                  <v-toolbar-title style="font-size: 16px; font-weight: 700"
                     >THÔNG TIN CHI TIẾT</v-toolbar-title
                  >

                  <v-spacer></v-spacer>

                  <v-btn
                     @click="closeDialog"
                     :append-icon="mdiClose"
                     >Đóng</v-btn
                  >
               </v-row>
            </v-container>
         </v-toolbar>
         <v-card-text class="pa-0">
            <v-container
               class="page"
               fluid
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
                                 Tác giả:
                                 {{ book.author }}
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
                              Lorem ipsum, dolor sit amet consectetur
                              adipisicing elit. Nihil quasi numquam architecto
                              vel officia quae nostrum cumque doloribus tenetur
                              eligendi magnam nam, recusandae vero minus rem,
                              consectetur molestiae velit id?
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
         </v-card-text>
      </v-card>
   </v-dialog>
</template>

<script setup>
   import { mdiBookOpenPageVariant, mdiBookmark, mdiClose } from '@mdi/js';
   import { ref } from 'vue';
   import { useRouter } from 'vue-router';

   const props = defineProps({
      book: Object,
   });

   const isOpenDialog = ref(false);
   const router = useRouter();
   const prevRoute = router.currentRoute.value;

   const openDialog = () => {
      isOpenDialog.value = true;
   };
   const closeDialog = () => {
      isOpenDialog.value = false;
      if (prevRoute.name === 'resultPage') {
         router.back();
      }
   };

   defineExpose({
      openDialog,
   });
</script>

<style scoped>
   p {
      font-size: 12px;
   }
</style>
