/* eslint-disable */
import axios from 'axios'
import api from '@/utils/api'

export default {
	state: {
		userInfo: {}
	},
	actions: {
		async getUserInfo({dispatch, commit}) {
			try {
				const response = await api.getUserInfo()
				commit('setUserInfo', response.data)
				return response
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},
		async updateUserInfo({dispatch, commit}, {formData, currentPassword}) {
			const token = btoa(unescape(encodeURIComponent(`${formData['ЭлектронныйАдрес']}:${currentPassword}`)))

			try {
				await api.updateUserInfo({token, formData})
				//console.log(response.data)
				//commit('setUserInfo', response.data)
			} catch (e) {
				if (!(e.response && e.response.status === 401)) {
					commit('setError', e)
				}
				throw e
			}
		},
		clearUserInfo({commit}) {
			commit('clearInfo')
		}
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		clearUserInfo(state) {
			state.userInfo = {}
		}
	},
	getters: {
		userInfo: state => state.userInfo
	},
}