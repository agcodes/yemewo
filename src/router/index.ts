import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/guess-word',
      name: 'guess-word',
      component: () => import('../views/GuessWord.vue'),
    },
    {
      path: '/guess-word-letters',
      name: 'guess-word-letters',
      component: () => import('../views/GuessWordLetters.vue'),
    },
    {
      path: '/anagram',
      name: 'anagram',
      component: () => import('../views/AnagramView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
