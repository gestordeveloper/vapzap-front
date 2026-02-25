import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import InstanceDetails from '../views/InstanceDetails.vue'
import ApiDocs from '../views/ApiDocs.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'Home', component: Home },
    ]
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/dashboard/instance/:name', name: 'InstanceDetails', component: InstanceDetails, meta: { requiresAuth: true } },
  { path: '/dashboard/api', name: 'ApiDocs', component: ApiDocs, meta: { requiresAuth: true } },
  { path: '/dashboard/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('vapzap_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
