import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import * as VueFire from 'vuefire';

Vue.config.productionTip = false

Vue.use(VueFire);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

