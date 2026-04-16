import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Connections from '../views/Connections.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import InstanceDetails from '../views/InstanceDetails.vue'
import Chats from '../views/Chats.vue'
import ApiDocs from '../views/ApiDocs.vue'
import Profile from '../views/Profile.vue'
import AgentConfig from '../views/AgentConfig.vue'

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
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'connections', name: 'Connections', component: Connections },
      { path: 'instance/:name', name: 'InstanceDetails', component: InstanceDetails },
      { path: 'instance/:name/agent', name: 'InstanceAgent', component: AgentConfig },
      { path: 'instance/:name/chats', name: 'InstanceChats', component: Chats }, // Keep old nested view just in case
      { path: 'chats', name: 'GlobalChats', component: Chats }, // Global view
      { path: 'api', name: 'ApiDocs', component: ApiDocs },
      { path: 'profile', name: 'Profile', component: Profile }
    ]
  }
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
