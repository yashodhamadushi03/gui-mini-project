import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

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
      component: RegisterView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/ChechkoutView.vue'),
    },

    {
      path: "/product/:id",
      name: "ProductDetail",
      component: () => import("@/views/ProductDetailView.vue"),
    },

    {
      path: '/products',
      name: 'ProductsView',
      component: () => import('@/views/ProductsView.vue'),
    },
  ],
})

export default router