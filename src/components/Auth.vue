<template>
	<b-container class="h-100">
		<div class="row align-items-center h-100">
			<div class="col col-sm-11 col-md-8 col-lg-6 col-xl-5 mx-auto">
				<Loader v-if="loading" />

				<div class="mb-5 text-center">
					<a href="https://greenpost.uz/" class="h1 m-0 text-success">GreenPost</a>
					<small class="ml-2">beta</small>
				</div>

				<b-tabs card active-nav-item-class="text-success">
					<b-tab title="Вход">
						<b-card-text>
							<b-form @submit.prevent="onLogin">
								<b-form-group label="E-mail/Login:" label-for="login-email">
									<b-form-input
										id="login-email"
										v-model.trim="login.email"
										type="text"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group label="Пароль:" label-for="login-password">
									<b-form-input
										id="login-password"
										v-model.trim="login.password"
										type="password"
										:disabled="loading"
										:required="false"
									/>
								</b-form-group>

								<b-button type="submit" variant="primary" :disabled="loading">
									Войти
								</b-button>
							</b-form>
						</b-card-text>
					</b-tab>

					<b-tab title="Регистрация">
						<b-card-text>
							<b-form @submit.prevent="onRegister">
								<b-form-group label="Имя:" label-for="register-name">
									<b-form-input
										id="register-name"
										v-model.trim="register.name"
										type="text"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group label="E-mail:" label-for="register-email">
									<b-form-input
										id="register-email"
										v-model.trim="register.email"
										type="email"
										:disabled="loading"
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
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group label="Пароль:" label-for="register-password">
									<b-form-input
										id="register-password"
										v-model.trim="register.password"
										type="password"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-button type="submit" variant="primary" :disabled="loading">
									Зарегистрироваться
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
				}
			}
		},
		mounted() {

		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
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
					// 'Фамилия': this.register.surname,
					'Фамилия': '',
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
					await this.$store.dispatch('login', {
						email: this.register.email,
						password: this.register.password,
					})
					await this.$router.push('/')
					this.$toast('Вы успешно зарегистрировались в системе GreenPost!')
					await this.$store.dispatch('setToast', 'register-success')
				} catch (e) {} finally {
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