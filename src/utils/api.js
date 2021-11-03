import axios from 'axios'
const registerToken = btoa(unescape(encodeURIComponent('default:dDhC54')))
const authorization = token => ({'Authorization': 'Basic ' + (token ? token : localStorage.getItem('token'))})
const baseUrl = process.env.NODE_ENV === 'production'
	? 'https://app.greenpost.uz/GreenPost/hs/ws/'
	: 'https://cors-anywhere.herokuapp.com/https://app.greenpost.uz/GreenPost/hs/ws/'

const api = {
	_request: null,
	_cancelToken() {
		this._request = axios.CancelToken.source()
	},
	getUserInfo: token => axios({
		url: baseUrl + 'userinfo',
		method: 'GET',
		headers: authorization(token),
	}),
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
	getAllOrders({startDate, endDate} = {}) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'listorders?status=all' + (startDate && endDate ? `&startdate=${startDate}&enddate=${endDate}` : ''),
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getActiveOrders() {
		this._cancelToken()
		return axios({
			url: baseUrl + 'listorders?status=active',
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
	getPayments() {
		this._cancelToken()
		return axios({
			url: baseUrl + 'balancemove',
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getTickets(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'ticketall?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	getTicketDetails(id) {
		this._cancelToken()
		return axios({
			url: baseUrl + '/ticket?id=' + id,
			method: 'GET',
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	newTicket(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + 'ticketnew',
			method: 'POST',
			data: data,
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	sendTicketMessage(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + '/ticketaddmessage',
			method: 'POST',
			data: data,
			headers: authorization(),
			cancelToken: this._request.token
		})
	},
	closeTicket(data) {
		this._cancelToken()
		return axios({
			url: baseUrl + '/ticketclose',
			method: 'POST',
			data: data,
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
