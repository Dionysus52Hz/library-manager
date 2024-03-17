<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps({
   book: Object,
});

const emit = defineEmits(['submitBook', 'cancel']);

const schema = yup.object().shape({
   title: yup
      .string()
      .required('Tựa đề không thể để trống.')
      .min(1, 'Tựa đề phải có ít nhất 1 kí tự.')
      .max(100, 'Tựa đề dài tối đa 100 kí tự.'),

   description: yup
      .string()
      .required('Miêu tả không thể để trống.')
      .min(1, 'Miêu tả phải có ít nhất 1 kí tự.')
      .max(256, 'Miêu tả dài tối đa 256 kí tự.'),
});

const { defineField, handleSubmit, resetForm } = useForm({
   validationSchema: schema,
   initialValues: {
      title: props.book.title,
      description: props.book.description,
      bookId: props.book.bookId,
      topic: props.book.topic,
      type: props.book.type,
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

const onSubmit = handleSubmit((values) => {
   const updateBook = { ...props.book, ...values };
   emit('submitBook', updateBook);
   resetForm();
});

defineExpose({ onSubmit });
</script>

<template>
   <v-form @submit="onSubmit" @keyup.enter="onSubmit" class="px-4">
      <v-text-field
         v-model="title"
         counter="100"
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
      <v-text-field
         v-model="bookId"
         v-bind="bookIdProps"
         label="Mã số trên kệ"
         type="text"
      />
      <v-text-field
         v-model="type"
         v-bind="typeProps"
         label="Phân loại"
         type="text"
      />

      <v-text-field
         v-model="topic"
         v-bind="topicProps"
         label="Chủ đề"
         color="primary"
      />

      <v-text-field
         v-model="author"
         v-bind="authorProps"
         label="Tác giả"
         color="primary"
      />
   </v-form>
</template>
