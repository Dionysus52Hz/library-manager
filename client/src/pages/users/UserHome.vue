<template>
   <img class="user-home-bg" src="../../assets/images/userHomeBg.jpg" alt="" />
   <v-container class="page">
      <v-row class="introduce">
         <v-col cols="12" md="6">
            <v-row>
               <v-col cols="12">
                  <h1 class="main-title">
                     Education is the premise of progress
                  </h1>
               </v-col>
               <v-col>
                  <search-bar @search-filter="test"></search-bar>
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
                        <span>150+</span>
                        <span>nghiên cứu khoa học</span>
                     </v-col>
                  </v-row>
               </v-col>
            </v-row>
         </v-col>
         <v-col cols="12" md="6">
            <img src="" alt="" class="introduce-image" />
         </v-col>
      </v-row>

      <v-row class="section">
         <v-col cols="12">
            <book-list :section="'Đề xuất cho bạn'"></book-list>
         </v-col>

         <v-col cols="12">
            <book-list :section="'Danh mục phân loại'">
               <v-tabs
                  v-model="topicSelected"
                  class="topic-select"
                  show-arrows
                  mandatory
                  slider-color="transparent"
                  center-active
               >
                  <v-tab>Tất cả</v-tab>

                  <v-tab>Khoa học máy tính</v-tab>
                  <v-tab>Công nghệ thông tin</v-tab>
                  <v-tab>Kĩ thuật phần mềm</v-tab>
                  <v-tab>Mạng máy tính và truyền thông</v-tab>
                  <v-tab>Mạng máy tính và truyền thông</v-tab>
               </v-tabs>
            </book-list>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup>
import SearchBar from '~/components/user/SearchBar.vue';
import BookList from '~/components/user/BookList.vue';
import { useCurrentPageStore } from '~/stores';
import { ref } from 'vue';

const currentPageStore = useCurrentPageStore();
currentPageStore.setCurrentPage('home');

const test = (data) => {
   console.log(data);
};

const topicSelected = ref(0);
</script>
<style scoped>
@import '~/assets/css/UserHome.css';
</style>
