import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/layout'

export const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/login')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard'),
      meta: {
        title: 'Dashboard',
        icon: 'orange'
      }
    }]
  },
  {
    path: '/usermanagement',
    component: Layout,
    children: [{
      path: '',
      name: 'UserManagement',
      component: () => import('@/views/UserManagement'),
      meta: {
        title: 'User Management',
        icon: 'user'
      }
    }]
  },
  {
    path: '/rgmanagement',
    component: Layout,
    children: [{
      path: '',
      name: 'ResourceGroupManagement',
      component: () => import('@/views/RGManagement'),
      meta: {
        title: 'Resource Group',
        icon: 'menu'
      }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      name: 'Profile',
      component: () => import('@/views/Profile'),
      meta: {
        title: 'Profile',
        icon: 'menu'
      }
    }]
  },
  {
    path: 'https://portal.azure.com/',
    meta: {
      title: 'Azure Portal',
      icon: 'link'
    }
  }
]

const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

export default router