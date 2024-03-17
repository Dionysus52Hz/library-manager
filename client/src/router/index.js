import { createRouter, createWebHistory } from 'vue-router';

//User Pages
import UserLayout from '~/layouts/UserLayout.vue';
import UserHome from '~/pages/users/UserHome.vue';
import BookCategories from '~/pages/users/BookCategories.vue';
import MyLibrary from '~/pages/users/MyLibrary.vue';
import HelpCenter from '~/pages/users/HelpCenter.vue';
import SignUp from '~/pages/users/SignUp.vue';
import Login from '~/pages/users/Login.vue';
import Result from '~/pages/users/Result.vue';

// Admin Pages
import AdminHome from '~/pages/admins/AdminHome.vue';
import AdminBookManagement from '~/pages/admins/BookManagement.vue';
import AdminUserManagement from '~/pages/admins/UserManagement.vue';

const routes = [
   {
      path: '/',
      component: UserLayout,
      children: [
         {
            path: '',
            name: 'userHomePage',
            component: UserHome,
         },
         {
            path: 'categories',
            name: 'bookCategoriesPage',
            component: BookCategories,
         },
         {
            path: 'my-library',
            name: 'myLibraryPage',
            component: MyLibrary,
         },
         {
            path: 'help-center',
            name: 'helpCenterPage',
            component: HelpCenter,
         },
         {
            path: 'sign-up',
            name: 'signUpPage',
            component: SignUp,
         },
         {
            path: 'login',
            name: 'loginPage',
            component: Login,
         },
         {
            path: 'result',
            name: 'resultPage',
            component: Result,
         },
      ],
   },

   {
      path: '/admin',
      name: 'adminHomePage',
      component: AdminHome,
      children: [
         {
            path: 'books-management',
            name: 'adminBookManagementPage',
            component: AdminBookManagement,
         },
         {
            path: 'users-management',
            name: 'adminUserManagementPage',
            component: AdminUserManagement,
         },
      ],
   },
];

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
});

export default router;
