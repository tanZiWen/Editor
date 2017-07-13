import Vue from 'vue'
import App from './App'
import store from './vuex/store'
import router from './router'
import { sync } from 'vuex-router-sync'
import VueForm from 'vue-form';

import './assets/css/bootstrap.min.css'
import './assets/css/bootstrap-select.css'
import './assets/css/bootswatch.css'
import './assets/css/font-awesome.min.css'
import './assets/css/jquery-ui.min.css'

Vue.use(VueForm);

//sync the route with the vuex store.
//this registers 'store.state.route'
sync(store, router)
Vue.http.options.emulateHTTP = true;
Vue.http.options.emulateJSON = true;
/* eslint-disable no-new */
const app = new Vue({
  router,
  store,
  ...App //Object spread copying everything form App.vue
})
app.$mount('#app')
