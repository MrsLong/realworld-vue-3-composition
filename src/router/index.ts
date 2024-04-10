import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthedUserStore } from '@/stores/authedUser'

const router = createRouter({
  linkExactActiveClass: 'active',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeGlobalView.vue')
        },
        {
          path: 'my-feed',
          name: 'home-my-feed',
          component: () => import('../views/HomeMyFeedView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'tag/:tag',
          name: 'home-tag',
          component: () => import('../views/HomeTagView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginOrRegisterView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/LoginOrRegisterView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/editor/:slug?',
      name: 'editor',
      component: () => import('../views/EditorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/article/:slug',
      name: 'article',
      component: () => import('../views/ArticleView.vue')
    },
    {
      path: '/profile/:username',
      component: () => import('../views/ProfileView.vue'),
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('../views/ProfileArticlesView.vue')
        },
        {
          path: 'favorites',
          name: 'profile-favorites',
          component: () => import('../views/ProfileFavoritesView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const store = useAuthedUserStore()
  if (to.meta.requiresAuth && !store.authedUser) {
    return { name: 'login' }
  }
})

export default router
