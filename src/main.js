import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueMask from 'v-mask'
// import {VueMaskDirective } from 'v-mask'
import Loader from '@/components/Loader'
import messagePlugin from '@/utils/message.plugin'
import dateFilter from '@/filters/date.filter'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('Loader', Loader)
Vue.use(messagePlugin)
Vue.filter('date', dateFilter)

Vue.use(VueMask, {
	placeholders: {
		'#': null,
		D: /\d/,
		S: /\S/,
	}
})
// Vue.directive('mask', VueMaskDirective);

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
