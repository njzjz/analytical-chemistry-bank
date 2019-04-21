import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import Vue2Storage from 'vue2-storage'

Vue.config.productionTip = false
Vue.use(Vue2Storage, {
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000
})

new Vue({
  render: h => h(App),
}).$mount('#app')
