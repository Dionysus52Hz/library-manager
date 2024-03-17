<template>
   <v-app-bar style="position: fixed">
      <v-spacer></v-spacer>
      <v-btn @click="refreshBook">Làm mới dữ liệu</v-btn>

      <v-btn @click="addFormDialog = true">Thêm tài liệu mới</v-btn>
      <v-btn>Xoá tất cả</v-btn>
      <v-spacer></v-spacer>
   </v-app-bar>
   <data-table
      :items="books"
      :itemProperties="
         bookProperties.filter((prop) => prop !== '_id' && prop !== 'slug')
      "
      :itemsCount="booksCount"
      :tableHeaders="tableHeaders"
      @itemActive="setActiveBook"
      @deleteItem="deleteBook"
      v-if="booksCount > 0"
   ></data-table>
   <p v-else>Không tìm thấy dữ liệu sách.</p>

   <div class="text-center pa-4">
      <v-dialog
         v-model="updateFormDialog"
         max-width="600"
         persistent
         scrollable
      >
         <v-card title="Sửa thông tin tài liệu">
            <v-divider></v-divider>

            <v-card-text>
               <book-form
                  :book="bookActive"
                  @submitBook="updateBook"
                  ref="updateForm"
               ></book-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="updateFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitUpdateBookForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>

      <v-dialog v-model="addFormDialog" max-width="600" persistent scrollable>
         <v-card title="Thêm tài liệu mới">
            <v-divider></v-divider>

            <v-card-text>
               <book-form
                  :book="{}"
                  ref="addForm"
                  @submitBook="addBook"
               ></book-form>
            </v-card-text>

            <v-card-actions class="px-6">
               <v-spacer></v-spacer>
               <v-btn
                  text="Huỷ bỏ"
                  variant="plain"
                  @click="addFormDialog = false"
               ></v-btn>

               <v-btn
                  color="primary"
                  text="Lưu"
                  variant="flat"
                  @click="submitAddBookForm"
               ></v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script>
import BookService from '~/services/BookService';
import DataTable from '~/components/admin/DataTable.vue';
import BookForm from '~/components/admin/BookForm.vue';
import { bookTableHeaders } from '~/utils/convertTableHeader';
export default {
   components: {
      DataTable,
      BookForm,
   },
   data() {
      return {
         tableHeaders: [],
         books: [],
         booksCount: 0,
         bookProperties: [],
         bookActive: {},
         updateFormDialog: false,
         addFormDialog: false,
      };
   },

   methods: {
      convertTimestamp(timestamp) {
         const date = new Date(timestamp);
         return date.toLocaleString('vi-VN');
      },

      convertBookTimestamp() {
         this.books.map((book) => {
            book.createdAt = this.convertTimestamp(book.createdAt);

            book.updateAt
               ? (book.updateAt = this.convertTimestamp(book.updateAt))
               : null;
         });
      },

      async getBooks() {
         try {
            this.books = await BookService.getAll();
            this.booksCount = this.books.length;
            this.bookProperties = Object.keys(this.books[0]);
         } catch (error) {
            console.log(error);
         }
      },

      async convertBookTableHeaders() {
         this.tableHeaders = this.bookProperties
            .filter((header) => bookTableHeaders.hasOwnProperty(header))
            .map((header) => bookTableHeaders[header]);
      },

      sortBooksByDate() {
         return this.books.sort(
            (bookA, bookB) => bookB.createdAt - bookA.createdAt
         );
      },

      async addBook(data) {
         try {
            await BookService.create(data);
            this.addFormDialog = false;
            await this.refreshBook();
         } catch (error) {
            console.log(error);
         }
      },

      async updateBook(data) {
         try {
            this.updateFormDialog = false;
            await BookService.updateOne(data._id, data);
            await this.refreshBook();
         } catch (error) {
            console.log(error);
         }
      },

      submitUpdateBookForm() {
         if (this.$refs.updateForm) {
            this.$refs.updateForm.onSubmit();
         }
      },

      submitAddBookForm() {
         if (this.$refs.addForm) {
            this.$refs.addForm.onSubmit();
         }
      },

      async setActiveBook(book) {
         this.bookActive = await BookService.findOneById(book._id);
         this.updateFormDialog = true;
      },

      async refreshBook() {
         await this.getBooks();
         await this.convertBookTableHeaders();
         await this.sortBooksByDate();
         await this.convertBookTimestamp();
      },

      async deleteBook(book) {
         try {
            await BookService.deleteOne(book._id);
            await this.refreshBook();
         } catch (error) {
            console.log(error);
         }
      },
   },

   mounted() {
      this.refreshBook();
   },
};
</script>

<style scoped></style>
