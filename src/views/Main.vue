<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col-sm-auto">
				<b-card class="order-search-form mb-3">
					<template v-slot:header>
						<div class="h3 mb-0">Отследить заказ</div>
					</template>
					<b-card-text>
						<b-form @submit.prevent="onSubmit">
							<div class="form-group mb-0">
								<b-input-group>
									<b-input size="lg" v-model.trim="track" :disabled="loading" placeholder="Введите номер отслеживания заказа" required />
									<b-input-group-append>
										<b-button type="submit" size="lg" variant="info" class="ml-1" :disabled="!track || loading">
											Отследить
										</b-button>
									</b-input-group-append>
								</b-input-group>
							</div>
						</b-form>
					</b-card-text>
				</b-card>
			</div>
			<div class="col-auto">
				<b-card class="mb-3">
					<template v-slot:header>
						<div class="h3 mb-0">Ваш адрес в Китае</div>
					</template>
					<b-card-text>
						<div>
							<b>Адрес:</b> 广州市白云区松洲街道罗冲围松南路13号富成大厦701室
						</div>
						<div>
							<b>Получатель:</b> ID: {{ userInfo['ID'] }}
						</div>
						<div>
							<b>Почтовый индекс:</b> 510160
						</div>
						<div>
							<b>Телефон:</b> +8618344567736
						</div>
					</b-card-text>
				</b-card>
			</div>
		</div>

		<div v-if="searched">
			<div class="table-responsive" v-if="orders.length">
				<table class="table table-bordered">
					<tr class="table-info">
						<th class="align-middle">Дата</th>
						<th class="align-middle">Наименование товара</th>
						<th class="align-middle">Номер отслеживания</th>
						<th class="align-middle">Статус</th>
						<th class="align-middle">Посылка</th>
					</tr>
					<tr v-for="order of orders" :key="order['Номер']">
						<td class="align-middle">
							{{ order['Дата'] }}
						</td>
						<td class="align-middle">
							{{ order['ВидТовара'] }}
						</td>
						<td class="align-middle">
							{{ order['ТрекПоступления'] }}
						</td>
						<td class="align-middle">
							{{ order['Статус'] }}
						</td>
						<td class="align-middle">
							{{ order['Посылка'] }}
						</td>
					</tr>
				</table>
			</div>
			<b-alert show variant="warning" class="d-inline-block" v-else>
				Заказ с указанным номером отслеживания не найден!
			</b-alert>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				searched: false,
				track: null,
				orders: [],
			}
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			onSubmit() {
				this.getOrders()
			},
			async getOrders() {
				const dateRange = {
					startDate: '',
					endDate: '',
				}

				this.loading = true

				try {
					const orders = (await this.$store.dispatch('getOrders', dateRange))
						.filter(order => order['ТрекПоступления'] === this.track)
					orders
						.sort((a, b) => Number(b['Номер'].replace(/\D/g, '')) - Number(a['Номер'].replace(/\D/g, '')))
					this.orders = orders
					this.searched = true
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			},
		},
	}
</script>