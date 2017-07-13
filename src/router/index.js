import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const App = r => require.ensure([], () => r(require('../App')), 'app')
const Home = r => require.ensure([], () => r(require('../components/Home')), 'home')

const routes = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        component: Home
      }
    ]
  },
  { path: '*', redirect: '/' }
];

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes
})
