<template>
	<div class="h-100">
		<Loader v-if="loading" />

		<div class="h-100" v-if="Object.keys(userInfo).length">
			<b-sidebar
				id="sidebar"
				width="200px"
				shadow
				no-header
				backdrop
				bg-variant="dark"
				text-variant="light"
				:no-close-on-route-change="desktop"
				v-model="sidebarOpen"
			>
				<div class="py-3">
					<div class="mb-3 text-center px-3">
						<b-dropdown variant="dark">
							<template v-slot:button-content>
								<div class="user-avatar">
									<b-avatar round />
								</div>
								<div class="mb-1 text-white-50 text-wrap text-break">
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
								<BIconPersonFill/> Профиль
							</b-dropdown-item-button>
							<b-dropdown-divider />
							<b-dropdown-item-button @click.prevent="logout">
								<BIconDoorOpenFill/> Выйти
							</b-dropdown-item-button>
						</b-dropdown>
					</div>

					<b-nav vertical class="cabinet-nav">
						<b-nav-item to="/" active-class="active" exact>
							<BIconHouseDoor/> ГЛАВНАЯ
						</b-nav-item>
						<b-nav-item to="/orders" active-class="active">
							<BIconCart3/> ТОВАРЫ
						</b-nav-item>
						<b-nav-item to="/packages" active-class="active">
							<BIconBox/> ПОСЫЛКИ
						</b-nav-item>
						<b-nav-item to="/payments" active-class="active" exact>
							<BIconWallet2/> РАСЧЕТЫ
						</b-nav-item>
						<b-nav-item to="/recipients" active-class="active" exact>
							<BIconPeople/> ПОЛУЧАТЕЛИ
						</b-nav-item>
						<b-nav-item to="/tickets" active-class="active" exact>
							<BIconEnvelope/> ОБРАЩЕНИЯ
						</b-nav-item>
					</b-nav>
				</div>
			</b-sidebar>

			<main id="main" class="cabinet-main" :class="{'sidebar-open': sidebarOpen}">
				<b-navbar class="py-0">
					<b-navbar-nav class="row align-items-center m-0 w-100">
						<b-nav-text class="col-auto px-0 mr-3">
							<b-button size="sm" variant="outline-light" @click.prevent="sidebarOpen = !sidebarOpen">
								<BIconList font-scale="2" />
							</b-button>
						</b-nav-text>
						<b-nav-text class="col px-0 text-center">
							<div class="d-inline-flex text-white text-left">
								<div class="logo">
									<img src="@/assets/logo-white.svg" alt="" />
								</div>
								<div>
									<div class="brand">
										GREEN POST
									</div>
									<div class="slogan">
										выгодная доставка из Китая
									</div>
								</div>
							</div>
						</b-nav-text>
					</b-navbar-nav>
				</b-navbar>

				<div class="px-0 py-3">
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
	//import {BIconPersonFill, BIconDoorOpenFill, BIconHouseDoor, BIconCart3, BIconBox, BIconWallet2, BIconPeople, BIconEnvelope, BIconList} from 'bootstrap-vue'
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
			'ModalProfile': require('@/components/ModalProfile.vue').default,
			//BIconPersonFill, BIconDoorOpenFill, BIconHouseDoor, BIconCart3, BIconBox, BIconWallet2, BIconPeople, BIconEnvelope, BIconList
		},
	}
</script>
