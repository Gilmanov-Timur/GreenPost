<template>
	<div class="h-100">
		<Loader v-if="loading" />

		<div class="h-100" v-if="Object.keys(userInfo).length">
			<b-sidebar
				id="sidebar"
				width="250px"
				shadow
				no-header
				backdrop
				bg-variant="dark"
				text-variant="light"
				:no-close-on-route-change="desktop"
				v-model="sidebarOpen"
			>
				<div class="py-3">
					<div class="mb-3 text-center">
						<b-dropdown variant="dark">
							<template v-slot:button-content>
								<div class="user-avatar">
									<b-avatar round />
								</div>
								<div class="mb-1 user-name text-white-50">
									{{ userInfo['Фамилия'] }}
									{{ userInfo['Имя'] }}
								</div>
								<div class="user-id mb-1 text-white">
									ID: {{ userInfo.ID }}
								</div>
								<span class="text-white">
								Баланс: <span :class="{'text-danger': balance < 0, 'text-success': balance > 0}">{{balance}}</span>$
							</span>
							</template>
							<b-dropdown-item-button @click.prevent="$bvModal.show('modal-profile')">
								<b-icon icon="person-fill"/> Профиль
							</b-dropdown-item-button>
							<b-dropdown-divider />
							<b-dropdown-item-button @click.prevent="logout">
								<b-icon icon="door-open-fill"/> Выйти
							</b-dropdown-item-button>
						</b-dropdown>
					</div>

					<b-nav vertical class="cabinet-nav">
						<b-nav-item to="/" active-class="active" exact>
							<b-icon icon="house-door"/> ГЛАВНАЯ
						</b-nav-item>
						<b-nav-item to="/orders" active-class="active" exact>
							<b-icon icon="cart3"/> ТОВАРЫ
						</b-nav-item>
						<b-nav-item to="/packages" active-class="active" exact>
							<b-icon icon="box"/> ПОСЫЛКИ
						</b-nav-item>
						<b-nav-item to="/payments" active-class="active" exact>
							<b-icon icon="wallet2"/> РАСЧЕТЫ
						</b-nav-item>
						<b-nav-item to="/recipients" active-class="active" exact>
							<b-icon icon="people"/> ПОЛУЧАТЕЛИ
						</b-nav-item>
						<b-nav-item to="/tickets" active-class="active" exact>
							<b-icon icon="envelope"/> ОБРАЩЕНИЯ
						</b-nav-item>
					</b-nav>
				</div>
			</b-sidebar>

			<main id="main" class="cabinet-main" :class="{'sidebar-open': sidebarOpen}">
				<b-navbar variant="info" class="py-0">
					<b-navbar-nav class="flex-row align-items-center">
						<b-nav-text>
							<b-button size="sm" variant="info" @click.prevent="sidebarOpen = !sidebarOpen">
								<b-icon icon="list" font-scale="2" />
							</b-button>
						</b-nav-text>
						<b-nav-text class="h4 ml-2 text-white">
							GreenPost
						</b-nav-text>
					</b-navbar-nav>
				</b-navbar>

				<div class="px-0 py-3 overflow-hidden">
					<b-container fluid>
						<router-view />
					</b-container>
				</div>
			</main>

			<ModalProfile />
		</div>
	</div>
</template>

<script>
	const desktopMinWidth = 992

	export default {
		data() {
			return {
				loading: true,
				sidebarOpen: window.innerWidth >= desktopMinWidth,
				desktop: window.innerWidth >= desktopMinWidth,
			}
		},
		async mounted() {
			this.$nextTick(() => {
				window.addEventListener('resize', this.onResize);
			})

			if (Object.keys(this.userInfo).length) {
				this.loading = false
				return
			}

			try {
				await this.$store.dispatch('getUserInfo')
			} catch (e) {
				if (!(e.response && e.response.status === 401)) {
					await this.$store.dispatch('setError', 'critical-error')
				}
			} finally {
				this.loading = false
			}
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.onResize);
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			},
			balance() {
				return this.userInfo['Баланс'].toFixed(2)
			},
		},
		watch: {

		},
		methods: {
			async logout() {
				await this.$store.dispatch('logout', 'logout')
				await this.$router.push('/auth')
			},
			onResize() {
				this.desktop = window.innerWidth >= desktopMinWidth
			},
		},
		components: {
			'ModalProfile': require('@/components/ModalProfile.vue').default
		},
	}
</script>
