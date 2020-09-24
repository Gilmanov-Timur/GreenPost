import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Loader from '@/components/Loader'
import messagePlugin from '@/utils/message.plugin'
import dateFilter from '@/filters/date.filter'
const VueInputMask = require('vue-inputmask').default

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueInputMask)
Vue.use(messagePlugin)
Vue.component('Loader', Loader)
Vue.filter('date', dateFilter)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
