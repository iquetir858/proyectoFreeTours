import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AboutView from '@/views/AboutView.vue'
import AdminView from '@/views/AdminView.vue'
import AdminCreateRoute from '@/views/AdminCreateRoute.vue'
import AdminListRoutes from '@/views/AdminListRoutes.vue'
import Client from '@/views/Client.vue'
import Guide from '@/views/Guide.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: LoginView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/admin/crear-ruta',
      name: 'adminRuta',
      component: AdminCreateRoute,
    },
    {
      path: '/admin/listar-rutas',
      name: 'adminList',
      component: AdminListRoutes,
    },
    {
      path: '/client',
      name: 'client',
      component: Client,
    },
    {
      path: '/guide',
      name: 'guide',
      component: Guide,
    },
  ],
})

export default router
