<template>
   <v-container
      fluid
      class="pa-6"
   >
      <v-row
         class="align-center"
         v-for="(_i, index) in numOfInputs"
         :key="index"
         :class="`bg-${inputsColorGroup[index]}-lighten-5`"
      >
         <v-col :cols="numOfInputs > 1 ? '' : 12">
            <v-sheet
               class="flex-center search-bar text-primary pa-1"
               rounded
            >
               <v-select
                  v-model="filterInputs[index].filter"
                  :items="CUSTOM_SEARCH_FILTERS_FOR_USER"
                  item-title="text"
                  item-value="value"
                  return-object
                  single-line
                  variant="outlined"
                  density="comfortable"
                  flat
                  hide-details="auto"
                  color="primary"
                  base-color="primary"
                  class="search-filter"
               ></v-select>

               <v-text-field
                  v-model.trim="filterInputs[index].searchText"
                  clearable
                  variant="solo"
                  density="comfortable"
                  flat
                  placeholder="Nhập từ khoá"
                  hide-details="auto"
                  class="text-primary"
                  @keyup.enter="submitSearch"
               >
               </v-text-field>
            </v-sheet>
         </v-col>

         <v-col
            cols="auto"
            v-if="numOfInputs > 1"
         >
            <v-btn
               @click="dropInput(index)"
               class="drop-input-btn"
               variant="tonal"
               color="primary"
               :icon="mdiTrashCan"
               rounded
            >
            </v-btn>
         </v-col>
         <v-col
            v-if="index < numOfInputs - 1"
            cols="12"
            class="text-center py-2"
            :class="{ 'bg-background': linkBetweenInputs[index] === false }"
         >
            <v-btn
               variant="text"
               :ripple="false"
               @click="toggleLink(index)"
               size="large"
               class="link-between-inputs-btn"
               rounded="xl"
            >
               <v-icon
                  :icon="linkBetweenInputs[index] ? mdiLink : mdiLinkOff"
                  style="transform: rotate(-90deg)"
                  class="me-3"
                  size="x-large"
               >
               </v-icon>
               {{ linkBetweenInputs[index] ? 'and' : 'or' }}
            </v-btn>
         </v-col>
      </v-row>

      <v-row class="text-center">
         <v-col>
            <v-btn
               @click="addInput"
               size="small"
               variant="tonal"
               color="primary"
               :append-icon="mdiPlus"
               >Thêm điều kiện tìm kiếm</v-btn
            >
         </v-col>

         <v-col cols="12">
            <v-btn
               color="primary"
               size="large"
               :append-icon="mdiMagnify"
               @click="submitSearch"
               :disabled="inputsAreEmpty === false ? false : true"
               >Tìm kiếm</v-btn
            >
         </v-col>
      </v-row>
   </v-container>
</template>
<script setup>
   import {
      mdiLink,
      mdiLinkOff,
      mdiMagnify,
      mdiPlus,
      mdiTrashCan,
   } from '@mdi/js';
   import { SEARCH_FILTERS_FOR_USER } from '~/utils/constants.js';
   import { ref, watch } from 'vue';

   const CUSTOM_SEARCH_FILTERS_FOR_USER = SEARCH_FILTERS_FOR_USER.filter(
      (filter) => filter.filter !== 'keyword'
   );
   const numOfInputs = ref(2);
   const linkBetweenInputs = ref(
      Array.from({ length: numOfInputs.value - 1 }, (_i) => true)
   );

   const filterInputs = ref(
      Array.from({ length: numOfInputs.value }, (_i) =>
         Object({
            filter: {
               filter: CUSTOM_SEARCH_FILTERS_FOR_USER[0].filter,
               text: CUSTOM_SEARCH_FILTERS_FOR_USER[0].text,
            },
            searchText: '',
            linkToNextInput: true,
         })
      )
   );
   const inputsAreEmpty = ref(true);
   const checkEmptyInputs = () => {
      inputsAreEmpty.value = false;
      for (const input of filterInputs.value) {
         if (input.searchText === '') {
            inputsAreEmpty.value = true;
         }
      }
   };
   const addInput = () => {
      numOfInputs.value++;
      linkBetweenInputs.value.push(true);
      filterInputs.value.push({
         filter: {
            filter: CUSTOM_SEARCH_FILTERS_FOR_USER[0].filter,
            text: CUSTOM_SEARCH_FILTERS_FOR_USER[0].text,
         },
         searchText: '',
         linkToNextInput: true,
      });
   };
   const dropInput = (i) => {
      numOfInputs.value--;
      linkBetweenInputs.value.splice(i, 1);
      filterInputs.value.splice(i, 1);
   };
   const toggleLink = (i) => {
      linkBetweenInputs.value[i] = !linkBetweenInputs.value[i];
      filterInputs.value[i].linkToNextInput =
         !filterInputs.value[i].linkToNextInput;
   };
   const filtersCombination = ref([]);
   const inputsColorGroup = ref({
      0: 'indigo',
      1: 'indigo',
   });
   const colors = [
      'pink',
      'deep-purple',
      'indigo',
      'light-green',
      'amber',
      'deep-orange',
   ];
   const generateRandomColor = () => {
      let colorChoosen = '';
      while (
         (colorChoosen === '' ||
            Object.values(inputsColorGroup.value).includes(colorChoosen)) &&
         Object.values(inputsColorGroup.value).length < colors.length
      ) {
         colorChoosen = colors[Math.floor(Math.random() * colors.length)];
      }
      return colorChoosen;
   };

   const assignInputsColorGroup = () => {
      inputsColorGroup.value = {};
      let i = 0;
      let colorChoosen = '';

      while (i < filterInputs.value.length) {
         if (filterInputs.value[i].linkToNextInput === false) {
            colorChoosen = generateRandomColor();
            inputsColorGroup.value[i] = colorChoosen;
            i++;
         } else {
            let j = i;
            colorChoosen = generateRandomColor();
            while (
               j < filterInputs.value.length &&
               filterInputs.value[j].linkToNextInput === true
            ) {
               inputsColorGroup.value[j] = colorChoosen;
               j++;
            }
            if (j < filterInputs.value.length) {
               inputsColorGroup.value[j] = colorChoosen;
            }
            i = j + 1;
         }
      }
   };

   const getFilterCombination = () => {
      filtersCombination.value = [];
      let subArray = [];
      let i = 0;

      while (i < filterInputs.value.length) {
         if (filterInputs.value[i].linkToNextInput === false) {
            subArray.push({
               [filterInputs.value[i].filter.filter]:
                  filterInputs.value[i].searchText,
            });

            filtersCombination.value.push(subArray);
            subArray = [];
            i++;
         } else {
            let j = i;

            while (
               j < filterInputs.value.length &&
               filterInputs.value[j].linkToNextInput === true
            ) {
               subArray.push({
                  [filterInputs.value[j].filter.filter]:
                     filterInputs.value[j].searchText,
               });

               j++;
            }
            if (j < filterInputs.value.length) {
               subArray.push({
                  [filterInputs.value[j].filter.filter]:
                     filterInputs.value[j].searchText,
               });
            }
            filtersCombination.value.push(subArray);

            subArray = [];
            i = j + 1;
         }
      }
   };

   watch(
      filterInputs,
      () => {
         getFilterCombination();
         checkEmptyInputs();
      },
      { deep: true }
   );

   watch(
      linkBetweenInputs,
      () => {
         assignInputsColorGroup();
      },
      { deep: true }
   );

   const emits = defineEmits(['submit-search']);
   const submitSearch = () => {
      if (!inputsAreEmpty.value) {
         console.log(214);
         emits('submit-search', Array.from(filtersCombination.value));
      }
   };
</script>

<style scoped>
   .search-bar {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
   }
   .search-bar .search-filter {
      font-size: 14px;
      font-weight: 800;
      max-width: 200px;
      letter-spacing: normal;
   }

   .drop-input-btn {
      border: 0.05rem dashed rgb(var(--v-theme-primary));
   }
</style>
