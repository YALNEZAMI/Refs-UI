import { createRouter, createWebHistory } from 'vue-router'
import AuthLoginVue from '@/views/AuthLogin.vue'
import AuthRegisterVue from '@/views/AuthRegister.vue'
import AdminRefsVue from '@/views/AdminRefs.vue'
import AddRefVue from '@/views/AddRef.vue'
import AdminProfileVue from '@/views/AdminProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/authentication/login'
    },
    {
      path: '/authentication',
      name: 'Authentication to the app',
      children: [
        {
          path: 'login',
          name: 'Login',
          component: AuthLoginVue
        },
        {
          path: 'register',
          name: 'Register',
          component: AuthRegisterVue
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      children: [
        {
          path: 'refs',
          name: 'the refs view',
          component: AdminRefsVue
        },
        {
          path: 'addRef',
          name: 'add ref',
          component: AddRefVue
        },
        {
          path: 'profile',
          name: 'user profile',
          component: AdminProfileVue
        }
      ]
    }
  ]
})

export default router
