/* eslint-disable */
import axios from 'axios'

const baseUrl = 'https://cors-anywhere.herokuapp.com/https://s.lavina.uz/Meest/hs/ws/'
// const baseUrl = 'http://localhost:8010/proxy/Meest/hs/ws/'
const registerToken = btoa(unescape(encodeURIComponent('default:dDhC54')))
const authorization = token => ({'Authorization': 'Basic ' + (token ? token : localStorage.getItem('token'))})

const api = {
	_request: null,
	_cancelToken() {
		this._request = axios.CancelToken.source()
	},
	getUserInfo(token) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'userinfo',
			method: 'GET',
			headers: authorization(token),
			cancelToken: this._request.token
		})
	},
	updateUserInfo({token, formData}) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'user',
			method: 'POST',
			data: formData,
			headers: authorization(token),
			cancelToken: this._request.token
		})
	},
	register(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'user',
			method: 'POST',
			data: data,
			headers: authorization(registerToken),
			cancelToken: this._request.token
		})
	},
	getOrders({startDate, endDate} = {}) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'listorders' + (startDate && endDate ? `?startdate=${startDate}&enddate=${endDate}` : ''),
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getOrderDetails(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'order?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	updateOrder(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'order',
			method: 'POST',
			data: data,
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	deleteOrder(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'deleteorder?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getPackages({startDate, endDate} = {}) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'listpackages' + (startDate && endDate ? `?startdate=${startDate}&enddate=${endDate}` : ''),
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getPackageDetails(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'package?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	updatePackage(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'package',
			method: 'POST',
			data: data,
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	deletePackage(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'deletepackage?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getRecipients() {
		this._cancelToken()
		return axios({
			url: baseUrl + 'listreciver',
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	updateRecipient(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'reciever',
			method: 'POST',
			data: data,
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	deleteRecipient(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'deletereciver?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	cancelRequest() {
		if (this._request) {
			this._request.cancel()
		}
	},
	isRequestCancelled(e) {
		return axios.isCancel(e)
	}
}

export default api