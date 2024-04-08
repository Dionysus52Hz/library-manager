<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';
   import { CURRENT_YEAR, BOOK_TOPICS, BOOK_TYPES } from '~/utils/constants';

   const props = defineProps({
      book: Object,
   });

   const emit = defineEmits(['submitBook', 'cancel']);

   const schema = yup.object().shape({
      title: yup
         .string()
         .required('Tựa đề không thể để trống')
         .max(256, 'Tựa đề dài tối đa 256 kí tự'),

      description: yup
         .string()
         .required('Mô tả không thể để trống')
         .min(2, 'Mô tả dài tối thiểu 2 kí tự')
         .max(256, 'Mô tả dài tối đa 256 kí tự'),

      bookId: yup.lazy((value) =>
         value === ''
            ? yup.string()
            : yup
                 .string()
                 .min(7, 'Mã số (nếu có) dài tối thiểu 7 kí tự')
                 .max(20, 'Mã số dài tối đa 20 kí tự')
      ),

      topic: yup.string().required('Cần chọn một chủ đề'),

      type: yup.string().required('Cần chọn một phân loại'),

      publisher: yup.lazy((value) =>
         value === ''
            ? yup.string()
            : yup
                 .string()
                 .min(2, 'Nhà xuất bản (nếu có) dài tối thiểu 2 kí tự')
                 .max(50, 'Nhà xuất bản dài tối đa 50 kí tự')
      ),

      publishYear: yup.lazy((value) =>
         value === ''
            ? yup
                 .number()
                 .nullable(true)
                 .transform(() => {
                    value = null;
                 })
            : yup
                 .number()
                 .integer()
                 .nullable(true)
                 .typeError('Giá trị phải là số nguyên')
                 .min(
                    1,
                    `Năm xuất bản phải nằm trong khoảng 1 - ${CURRENT_YEAR}`
                 )
                 .max(
                    CURRENT_YEAR,
                    `Năm xuất bản phải nằm trong khoảng 1 - ${CURRENT_YEAR}`
                 )
      ),

      author: yup.lazy((value) =>
         value === ''
            ? yup.string()
            : yup.string().max(256, 'Tên tác giả dài tối đa 256 kí tự')
      ),
   });

   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
         title: props.book.title,
         description: props.book.description,
         bookId: props.book.bookId,
         topic: props.book.topic,
         type: props.book.type,
         publisher: props.book.publisher,
         publishYear: props.book.publishYear,
         author: props.book.author,
      },
   });

   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });

   const [title, titleProps] = defineField('title', vuetifyConfig);
   const [description, descriptionProps] = defineField(
      'description',
      vuetifyConfig
   );
   const [bookId, bookIdProps] = defineField('bookId', vuetifyConfig);
   const [topic, topicProps] = defineField('topic', vuetifyConfig);
   const [type, typeProps] = defineField('type', vuetifyConfig);
   const [author, authorProps] = defineField('author', vuetifyConfig);
   const [publisher, publisherProps] = defineField('publisher', vuetifyConfig);
   const [publishYear, publishYearProps] = defineField(
      'publishYear',
      vuetifyConfig
   );

   const onSubmit = handleSubmit((values) => {
      const updateBook = { ...props.book, ...values };
      emit('submitBook', updateBook);

      resetForm();
   });

   defineExpose({ onSubmit });
</script>

<template>
   <v-form
      @submit="onSubmit"
      @keyup.enter="onSubmit"
      class="px-4"
   >
      <v-text-field
         v-model="title"
         counter="256"
         v-bind="titleProps"
         label="Tựa đề"
      />

      <v-text-field
         counter="256"
         v-model="description"
         v-bind="descriptionProps"
         label="Mô tả"
         type="text"
      />

      <v-select
         class="search-filter"
         v-model="type"
         v-bind="typeProps"
         :items="BOOK_TYPES"
         label="Phân loại"
         return-object
         density="default"
      ></v-select>

      <v-select
         class="search-filter"
         v-model="topic"
         v-bind="topicProps"
         :items="BOOK_TOPICS"
         label="Chủ đề"
         return-object
         density="default"
      ></v-select>

      <v-text-field
         counter="20"
         v-model="bookId"
         v-bind="bookIdProps"
         label="Mã số trên kệ"
         type="text"
      />

      <v-text-field
         counter="256"
         v-model="author"
         v-bind="authorProps"
         label="Tác giả"
         color="primary"
      />

      <v-text-field
         counter="50"
         v-model="publisher"
         v-bind="publisherProps"
         label="Nhà xuất bản"
         color="primary"
      />

      <v-text-field
         v-model="publishYear"
         v-bind="publishYearProps"
         label="Năm xuất bản"
         color="primary"
      />
   </v-form>
</template>
