import api from '@/utils/api'
import axios from "axios";

export default {
	actions: {
		async login({commit}, {email, password}) {
			const token = btoa(unescape(encodeURIComponent(`${email}:${password}`)))

			try {
				const response = await api.getUserInfo(token)
				localStorage.setItem('token', token)
				commit('setUserInfo', response.data)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async register({commit}, formData) {
			try {
				const response = await api.register(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async logout({commit}, message) {
			localStorage.removeItem('token')
			commit('clearUserInfo')

			if (message === 'logout') {
				commit('setToast', 'logout')
			} else if (message === 'login') {
				commit('setToast', 'login')
			}
		}
	}
}