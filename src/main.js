import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

//  as I recall, if these aren't in the global scope,
//  vue-easytable won't recognize the cell components at
//  cellmerge() . . . something to look into
import 'vue-easytable/libs/themes-base/index.css'
import { VTable, VPagination } from 'vue-easytable'
import resCell from './components/resCell.vue'
import freeCell from './components/freeCell.vue'
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
Vue.component(resCell.name, resCell)
Vue.component(freeCell.name, freeCell)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
