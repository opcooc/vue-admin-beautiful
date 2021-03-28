import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import Particles from 'particles.vue'
import '@/layouts/export'

Vue.config.productionTip = false
Vue.use(Particles)
new Vue({
  el: '#vue-admin-beautiful',
  router,
  store,
  render: (h) => h(App),
})
