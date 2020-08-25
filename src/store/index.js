import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'
import auth from './auth'
import info from './info'
import orders from './orders'
import packages from './packages'
import recipients from './recipients'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		error: null,
		toast: null,
	},
	actions: {
		setError({commit}, error) {
			commit('setError', error)
		},
		clearError({commit}) {
			commit('clearError')
		},
		clearToast({commit}) {
			commit('clearToast')
		},
		cancelRequest() {
			api.cancelRequest()
		},
	},
	mutations: {
		setError(state, error) {
			let message

			if (error.response && error.response.status === 401) {
				message = 'unauthorized'
			} else if (error.response && error.response.data) {
				message = error.response.data
			} else if (typeof error === 'string') {
				message = error
			} else {
				message = 'something-went-wrong'
			}

			state.error = message
		},
		clearError(state) {
			state.error = null
		},
		setToast(state, message) {
			state.toast = message
		},
		clearToast(state) {
			state.toast = null
		},
	},
	getters: {
		error: state => state.error,
		toast: state => state.toast,
	},
	modules: {
		auth, info, orders, packages, recipients
	}
})
