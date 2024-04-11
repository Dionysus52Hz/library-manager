<script setup>
   import { useForm } from 'vee-validate';
   import * as yup from 'yup';

   const props = defineProps({
      user: Object,
   });

   const emit = defineEmits(['submitUser', 'cancel']);

   const schema = yup.object().shape({
      userId: yup
         .string()
         .required('Mã số sinh viên không thể để trống.')
         .max(8, 'Mã số sinh viên tối đa 8 kí tự')
         .matches(/^[A-Z][0-9]{7}$/, 'Mã số sinh viên không đúng định dạng'),

      email: yup
         .string()
         .required('Email không thể để trống')
         .email('Email không đúng định dạng'),

      password: yup
         .string()
         .required('Mật khẩu không thể để trống.')
         .min(8, 'Mật khẩu phải có ít nhất 8 kí tự.')
         .max(255, 'Mật khẩu dài tối đa 255 kí tự.'),

      username: yup
         .string()
         .required('Tên không thể để trống.')
         .max(50, 'Tên dài tối đa 50 kí tự.'),
   });

   const { defineField, handleSubmit, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
         userId: props.user.userId,
         password: props.user.password,
         username: props.user.username,
      },
   });

   const vuetifyConfig = (state) => ({
      props: {
         'error-messages': state.errors,
      },
   });

   const [userId, userIdProps] = defineField('userId', vuetifyConfig);
   const [password, passwordProps] = defineField('password', vuetifyConfig);
   const [username, usernameProps] = defineField('username', vuetifyConfig);
   const [gender, genderProps] = defineField('gender', vuetifyConfig);

   const onSubmit = handleSubmit((values) => {
      const updateUser = { ...props.user, ...values };
      emit('submitUser', updateUser);
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
         v-model="userId"
         counter="8"
         v-bind="userIdProps"
         label="Mã số sinh viên"
      />

      <v-text-field
         counter="255"
         v-model="password"
         v-bind="passwordProps"
         label="Mật khẩu"
         type="text"
      />

      <v-text-field
         counter="50"
         v-model="username"
         v-bind="usernameProps"
         label="Tên"
         type="text"
      />

      <v-text-field
         counter="50"
         v-model="gender"
         v-bind="genderProps"
         label="Giới tính"
         type="text"
      />
   </v-form>
</template>
