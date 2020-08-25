<template>
	<b-container class="h-100">
		<div class="row align-items-center h-100">
			<div class="col col-sm-11 col-md-8 col-lg-6 col-xl-5 mx-auto">
				<Loader v-if="loading" />

				<div class="h1 mb-4 text-center text-success">GreenPost</div>

				<b-tabs card active-nav-item-class="text-success" v-model="activeTab">
					<b-tab title="Вход">
						<b-card-text>
							<b-form @submit.prevent="onLogin">
								<b-form-group label="E-mail/Login:" label-for="login-email">
									<b-form-input
										id="login-email"
										v-model.trim="login.email"
										type="text"
										required
									/>
								</b-form-group>

								<b-form-group label="Пароль:" label-for="login-password">
									<b-form-input
										id="login-password"
										v-model.trim="login.password"
										type="password"
										:required="false"
									/>
								</b-form-group>

								<b-button type="submit" variant="primary" :disabled="loading">
									Вход
								</b-button>
							</b-form>
							<b-alert variant="success" :show="registered" class="mt-4">
								<div class="font-weight-bold">Регистрация успешно завершена!</div>
								Теперь вы можете войти используя указанные email и пароль при регистрации.
							</b-alert>
						</b-card-text>
					</b-tab>

					<b-tab title="Регистрация" v-if="!registered">
						<b-card-text>
							<b-form @submit.prevent="onRegister">
								<b-form-group label="Фамилия:" label-for="register-surname">
									<b-form-input
										id="register-surname"
										v-model.trim="register.surname"
										type="text"
										required
									/>
								</b-form-group>

								<b-form-group label="Имя:" label-for="register-name">
									<b-form-input
										id="register-name"
										v-model.trim="register.name"
										type="text"
										required
									/>
								</b-form-group>

								<b-form-group label="E-mail:" label-for="register-email">
									<b-form-input
										id="register-email"
										v-model.trim="register.email"
										type="text"
										required
									/>
								</b-form-group>

								<b-form-group label="Номер телефона:" label-for="register-phone">
									<input
										type="tel"
										id="register-phone"
										class="form-control"
										v-model="register.phone"
										v-mask="'+DDDDDDDDDDDD'"
										required
									/>
								</b-form-group>

								<b-form-group label="Пароль:" label-for="register-password">
									<b-form-input
										id="register-password"
										v-model.trim="register.password"
										type="password"
										required
									/>
								</b-form-group>

								<b-form-group label="Подтвердите пароль:" label-for="register-password2">
									<b-form-input
										id="register-password2"
										v-model.trim="register.password2"
										type="password"
										required
									/>
								</b-form-group>

								<b-button type="submit" variant="primary" :disabled="loading">
									Регистрация
								</b-button>
							</b-form>
						</b-card-text>
					</b-tab>
				</b-tabs>
			</div>
		</div>
	</b-container>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				registered: false,
				activeTab: 0,
				login: {
					email: '',
					password: '',
				},
				register: {
					surname: '',
					name: '',
					email: '',
					phone: '',
					password: '',
					password2: '',
				}
			}
		},
		mounted() {

		},
		methods: {
			async onLogin() {
				const formData = {
					email: this.login.email,
					password: this.login.password
				}

				if (this.loading) {
					return
				}

				this.loading = true

				try {
					await this.$store.dispatch('login', formData)
					await this.$router.push('/')
				} catch (e) {} finally {
					this.loading = false
				}
			},
			async onRegister() {
				const formData = {
					'НомерКлиента': '',
					'Фамилия': this.register.surname,
					'Имя': this.register.name,
					'ЭлектронныйАдрес': this.register.email,
					'НомерТелефона': this.register.phone,
					'Пароль': this.register.password,
				}

				if (this.loading) {
					return
				}

				this.loading = true

				try {
					await this.$store.dispatch('register', formData)
					this.activeTab = 0
					this.registered = true
				} catch (e) {

				} finally {
					this.loading = false
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		watch: {

		}
	}
</script>