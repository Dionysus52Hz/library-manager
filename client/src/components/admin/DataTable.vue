<template>
   <v-container
      fluid
      style="position: relative; max-width: 1440px"
      class="pt-4"
   >
      <v-row class="data-full-show flex-center">
         <v-col class="prop v-col-3 flex-center">
            <Transition
               name="prop"
               mode="out-in"
            >
               <span :key="activeProp">{{
                  activeProp ? activeProp : tableHeaders[0]
               }}</span>
            </Transition>
         </v-col>

         <div class="data v-col-9">{{ activeData ? activeData : '' }}</div>
      </v-row>

      <v-row class="sort-bar">
         <v-col
            cols="auto"
            class="d-flex align-center"
         >
            <p>Sắp xếp theo</p>
         </v-col>
         <v-col>
            <v-select
               v-model="sortCondition.sortBySelected"
               :items="sortBy"
               item-title="text"
               item-value="value"
               :hide-details="true"
            ></v-select>
         </v-col>
         <v-col
            cols="auto"
            class="d-flex align-center"
         >
            <p>Thứ tự</p>
         </v-col>
         <v-col>
            <v-select
               v-model="sortCondition.sortTypeSelected"
               :items="sortType"
               item-title="text"
               item-value="value"
               :hide-details="true"
            ></v-select>
         </v-col>

         <v-col
            cols="auto"
            class="d-flex align-center"
         >
            <p>Số lượng hiển thị</p>
         </v-col>
         <v-col cols="2">
            <v-select
               v-model="documentsPerPageSelected"
               :items="documentsPerPage"
               label="Select"
               return-object
               single-line
               :hide-details="true"
            ></v-select>
         </v-col>
      </v-row>

      <v-row>
         <v-col
            cols="12"
            style="overflow: scroll; max-height: 500px; border: 1px solid #ccc"
         >
            <table>
               <tr>
                  <td></td>
                  <th v-for="header in tableHeaders">
                     {{ header }}
                  </th>
               </tr>

               <tr v-for="(item, rowIndex) in itemsRendering">
                  <td>
                     <div class="d-flex flex-column">
                        <v-btn
                           @click="getActiveItem(item)"
                           class="edit-btn bg-primary"
                           variant="flat"
                           size="small"
                           >Sửa</v-btn
                        >
                        <v-btn
                           @click="deleteItem(item)"
                           class="delete-btn bg-danger"
                           variant="flat"
                           size="small"
                           >Xoá</v-btn
                        >
                     </div>
                  </td>
                  <td
                     v-for="(prop, colIndex) in itemProperties"
                     @click="
                        showDataInCell(item[prop]),
                           setActiveCell(rowIndex, colIndex),
                           setPropName(colIndex, tableHeaders)
                     "
                     :class="{
                        active:
                           activeCellRowIndex === rowIndex &&
                           activeCellColIndex === colIndex,
                     }"
                  >
                     {{ item[prop] }}
                  </td>
               </tr>
            </table>
         </v-col>
      </v-row>

      <v-row justify="center">
         <v-col cols="8">
            <div class="text-center">
               <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="5"
                  :next-icon="this.icons.mdiMenuRight"
                  :prev-icon="this.icons.mdiMenuLeft"
               ></v-pagination>
            </div>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
   import { sortAscending, sortDescending } from '~/utils/sort';
   export default {
      props: {
         items: {
            type: Array,
            required: true,
         },
         itemsCount: {
            type: Number,
            required: true,
         },
         itemProperties: {
            type: Array,
            required: true,
         },
         tableHeaders: {
            type: Array,
            required: true,
         },
         sortBy: {
            type: Array,
            required: true,
         },
         sortType: {
            type: Array,
            required: true,
         },
      },

      emits: ['itemActive', 'deleteItem'],

      data() {
         return {
            localItems: this.items,
            activeData: '',
            activeCellRowIndex: null,
            activeCellColIndex: null,
            activeProp: '',
            currentPage: 1,
            documentsPerPage: [10, 25, 50],
            documentsPerPageSelected: 0,
            documentsRange: {},
            totalPages: 1,
            itemsRendering: [],
            icons: {
               mdiMenuLeft,
               mdiMenuRight,
            },
            sortCondition: {
               sortBySelected: this.sortBy[0].value,
               sortTypeSelected: this.sortType[0].value,
            },
         };
      },

      methods: {
         renderItems() {
            this.totalPages = Math.ceil(
               this.items.length / this.documentsPerPageSelected
            );

            this.documentsRange = {
               startIdx: (this.currentPage - 1) * this.documentsPerPageSelected,
               endIdx: this.currentPage * this.documentsPerPageSelected - 1,
            };

            this.itemsRendering = this.items.slice(
               this.documentsRange.startIdx,
               this.documentsRange.endIdx + 1
            );
         },
         showDataInCell(data) {
            this.activeData = data;
         },

         setActiveCell(rowIndex, colIndex) {
            this.activeCellRowIndex = rowIndex;
            this.activeCellColIndex = colIndex;
         },

         setPropName(colIndex, tableHeaders) {
            this.activeProp = tableHeaders[colIndex];
         },

         getActiveItem(item) {
            this.$emit('itemActive', item);
         },

         deleteItem(item) {
            this.$emit('deleteItem', item);
         },
      },

      watch: {
         sortCondition: {
            handler: function (newValue) {
               if (newValue.sortTypeSelected === 1) {
                  sortAscending(this.items, newValue.sortBySelected);
               } else sortDescending(this.items, newValue.sortBySelected);
               this.renderItems();
            },
            deep: true,
         },
         items() {
            sortAscending(this.items, this.sortCondition.sortBySelected);
            this.currentPage = 1;
            this.renderItems();
         },
         documentsPerPageSelected() {
            this.currentPage = 1;
            this.renderItems();
         },
         currentPage() {
            this.renderItems();
         },
      },

      created() {
         this.documentsPerPageSelected = this.documentsPerPage[0];
         sortAscending(this.items, this.sortCondition.sortBySelected);
         this.renderItems();
      },
   };
</script>

<style scoped>
   @import '~/assets/css/Table.css';
</style>
