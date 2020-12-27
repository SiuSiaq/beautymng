import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Schedule from '../views/Schedule'
import Clients from '../views/Clients'
import Treatments from '../views/Treatments'
import Products from '../views/Products'
import Today from '../views/Today'
import Confirms from '../views/Confirms'
import Login from '../views/Login'
import Register from '../views/Register'
import Settings from '../views/Settings'
import Statistics from '../views/Statistics'
import { auth } from '@/main'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/calendar',
    name: 'About',
    component: Schedule,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/treatments',
    name: 'Treatments',
    component: Treatments,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/today',
    name: 'today',
    component: Today,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/confirms',
    name: 'confirms',
    component: Confirms,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Statistics,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresGuest: true,
    },
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!auth.currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (auth.currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router
