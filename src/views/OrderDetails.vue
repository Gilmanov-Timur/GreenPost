<template>
	<div>
		<Loader v-if="loading" />

		<div class="row mb-4 mx-n2">
			<div class="col-auto px-2">
				<router-link to="/orders" title="Вернуться к списку товаров">
					<b-icon icon="arrow-left-circle" font-scale="2" variant="info" />
				</router-link>
			</div>
			<div class="col px-2">
				<h4 class="mb-0">Детали товара <b>{{ this.orderId }}</b></h4>
			</div>
		</div>

		<template v-if="orderId">
			<div class="table-responsive" v-if="!loading">
				<table class="table table-bordered table-striped">
					<tr>
						<td>Наименование товара</td>
						<td>{{ order['ВидТовара'] }}</td>
					</tr>
					<tr>
						<td>Номер отслеживания</td>
						<td>{{ order['ТрекПоступления'] }}</td>
					</tr>
					<tr>
						<td>Количество</td>
						<td>{{ order['Количество'] }}</td>
					</tr>
					<tr>
						<td>Ценность</td>
						<td>{{ order['Ценность'] }} $</td>
					</tr>
					<tr>
						<td>Вес</td>
						<td>{{ order['Вес'] }} кг</td>
					</tr>
					<tr v-if="order['Фото']">
						<td>Фото</td>
						<td><img :src="order['Фото']" alt="" /></td>
					</tr>
					<tr>
						<td>Комментарий</td>
						<td>{{ order['Комментарий'] }}</td>
					</tr>
					<tr v-if="order['Несоответствие']">
						<td>Несоответствие</td>
						<td>{{ order['Несоответствие'] }}</td>
					</tr>
					<tr v-if="Object.keys(this.options).length">
						<td>Дополнительные услуги</td>
						<td>
							<ul class="m-0">
								<li v-if="options.check">
									Проверка на соответствие
								</li>
								<li v-if="options.photoReport">
									Фотоотчет
								</li>
								<li v-if="options.repack">
									Переупаковать
								</li>
								<li v-if="options.originalPackage">
									Оставить оригинальную упаковку
								</li>
							</ul>
						</td>
					</tr>
				</table>
			</div>
		</template>
		<b-alert variant="danger" show class="mt-4" v-else>
			Заказ не выбран!
		</b-alert>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				orderId: this.$route.params.id,
				loading: true,
				order: {},
				options: {},
			}
		},
		async mounted() {
			if (!this.orderId) {
				this.loading = false
				return
			}

			try {
				const order = await this.$store.dispatch('getOrderDetails', this.orderId)
				this.order = order
				this.options = this.transformOptions(order['ДополнительныеУслуги'])
			} catch (e) {} finally {
				this.loading = false
			}
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			transformOptions(options = []) {
				const services = {}

				options.forEach(option => {
					if (!option['Заказать']) {
						return
					}

					switch(option['Услуга']) {
						case('000000002'):
							services.repack = true
							break

						case('000000005'):
							services.photoReport = true
							break

						case('000000006'):
							services.originalPackage = true
							break

						case('000001001'):
							services.check = true
							break
					}
				})

				return services
			}
		}
	}
</script>