import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ListView from '@/views/ListView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/lists/:id',
    name: 'List',
    component: ListView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
