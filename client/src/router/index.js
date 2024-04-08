import { createRouter, createWebHistory } from 'vue-router';

//User Pages
import UserLayout from '~/layouts/UserLayout.vue';
import UserHome from '~/pages/user/UserHome.vue';
import BookCategories from '~/pages/user/BookCategories.vue';
import MyLibrary from '~/pages/user/MyLibrary.vue';
import HelpCenter from '~/pages/user/HelpCenter.vue';
import SignUp from '~/pages/user/SignUp.vue';
import Login from '~/pages/user/Login.vue';
import Result from '~/pages/user/Result.vue';
import BookDetails from '~/pages/user/BookDetails.vue';

// Admin Pages
import AdminHome from '~/pages/admin/AdminHome.vue';
import AdminBookManagement from '~/pages/admin/BookManagement.vue';
import AdminUserManagement from '~/pages/admin/UserManagement.vue';

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
            path: 'search/:filter',
            name: 'resultPage',
            component: Result,
         },
         {
            path: 'books/:slug',
            name: 'bookDetailsPage',
            components: {
               default: Result,
               BookDetails,
            },
            beforeEnter: () => {},
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
   scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
         return {
            el: to.hash,
         };
      }
   },
});

export default router;
