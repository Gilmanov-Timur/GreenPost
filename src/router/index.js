/* eslint-disable */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/auth',
		name: 'Auth',
		component: () => import('../layouts/Auth.vue'),
	},
	{
		path: '/',
		component: () => import('../layouts/Cabinet.vue'),
		children: [
			{
				path: '/',
				name: 'cabinetMain',
				meta: {auth: true},
				component: () => import('../views/Main.vue')
			},
			{
				path: 'orders',
				name: 'cabinetOrders',
				meta: {auth: true},
				component: () => import('../views/Orders.vue')
			},
			{
				path: 'order-details/:id',
				name: 'cabinetOrderDetails',
				meta: {auth: true},
				component: () => import('../views/OrderDetails.vue')
			},
			{
				path: 'packages',
				name: 'cabinetPackages',
				meta: {auth: true},
				component: () => import('../views/Packages.vue')
			},
			{
				path: 'package-details/:id',
				name: 'cabinetPackageDetails',
				meta: {auth: true},
				component: () => import('../views/PackageDetails.vue')
			},
			{
				path: 'recipients',
				name: 'cabinetRecipients',
				meta: {auth: true},
				component: () => import('../views/Recipients.vue')
			},
		]
	},
	{
		path: '*',
		component: () => import('../layouts/Error.vue')
	}
]

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token')

	if (!token && to.name !== 'Auth') {
		next('/auth')
	} else if (token && to.name === 'Auth') {
		next('/')
	} else {
		next()
	}
});

export default router
