import axios from 'axios'
import api from '@/utils/api'

export default {
	actions: {
		async getOrders({commit}, dateRange) {
			try {
				const response = await api.getOrders(dateRange)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async getOrderDetails({commit}, orderId) {
			try {
				const response = await api.getOrderDetails(orderId)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async updateOrder({commit}, formData) {
			try {
				const response = await api.updateOrder(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async deleteOrder({commit}, orderId) {
			try {
				const response = await api.deleteOrder(orderId)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},
	}
}