<template>
   <v-container
      fluid
      style="position: relative; max-width: 1440px"
      class="pt-4"
   >
      <v-row class="data-full-show flex-center">
         <v-col class="prop v-col-3 flex-center">
            <Transition name="prop" mode="out-in">
               <span :key="activeProp">{{
                  activeProp ? activeProp : tableHeaders[0]
               }}</span>
            </Transition>
         </v-col>

         <div class="data v-col-9">{{ activeData ? activeData : '' }}</div>
      </v-row>

      <v-row>
         <v-col
            style="overflow: scroll; max-height: 500px; border: 1px solid #ccc"
         >
            <table>
               <tr>
                  <td></td>
                  <th v-for="header in tableHeaders">
                     {{ header }}
                  </th>
               </tr>

               <tr v-for="(item, rowIndex) in items">
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
            <v-container class="max-width">
               <v-pagination
                  v-model="page"
                  :length="15"
                  class="my-4"
               ></v-pagination>
            </v-container>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
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
   },

   emits: ['itemActive', 'deleteItem'],

   data() {
      return {
         activeData: '',
         activeCellRowIndex: null,
         activeCellColIndex: null,
         activeProp: '',
         page: 1,
      };
   },

   methods: {
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
};
</script>

<style scoped>
@import '~/assets/css/Table.css';
</style>
