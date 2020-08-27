import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(VueRouter)

  const routes = [
  {
    path: '*',
    name: 'home',
    component: Home,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    beforeEnter: ifNotAuthenticated,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const ifNotAuthenticated = (to, from, next) => {
  if (store.getters.status) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  const token = localStorage.getItem('token');
  if (!store.getters.status){
    next()
    return
  }
  next('/signin');
}

router.beforeEach((to,from,next)=>{
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log(token,requiresAuth);

  if(requiresAuth && !token) next('signin');
  else next();
})

export default router
