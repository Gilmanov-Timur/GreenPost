<template>
	<div>
		<div class="row">
			<div class="col">
				<h2 class="mb-4">Посылки</h2>
			</div>
		</div>

		<Loader v-if="loading" />

		<b-tabs card active-nav-item-class="text-success" v-model="activeTab">
			<b-tab title="В обработке">
				<b-card-text>
					<div class="table-responsive">
						<table class="table table-bordered">
							<tr class="table-info">
								<th>Дата</th>
								<th>Тип доставки</th>
								<th>Номер посылки</th>
								<th>Вес</th>
								<th>Ценность</th>
								<th>Получатель</th>
								<th>Статус</th>
								<th />
							</tr>
							<tr v-for="pack of processedPackages" :key="pack['Номер']">
								<td>{{ pack['Дата'] }}</td>
								<td>{{pack['ТипДоставки']}}</td>
								<td>{{pack['Номер']}}</td>
								<td>{{pack['ОбщийВес']}} кг</td>
								<td>{{pack['ОбщаяЦенность']}} $</td>
								<td>{{pack['Получатель']}}</td>
								<td>{{pack['Статус']}}</td>
								<td class="text-nowrap">
									<b-button size="sm" variant="info" class="mx-1" :to="`package-details/${pack['Номер']}`">
										<b-icon icon="eye-fill"/>
									</b-button>
									<b-button size="sm" variant="danger" class="mx-1" @click.prevent="() => onDelete(pack['Номер'], pack['НомерГотовыйГруз'])" v-if="pack['Статус'] === 'В обработке'">
										<b-icon icon="trash"/>
									</b-button>
								</td>
							</tr>
						</table>
					</div>
				</b-card-text>
			</b-tab>
			<b-tab title="На доставке">
				<b-card-text>
					<div class="table-responsive">
						<table class="table table-bordered">
							<tr class="table-info">
								<th>Дата</th>
								<th>Тип доставки</th>
								<th>Трек посылки</th>
								<th>Вес</th>
								<th>Ценность</th>
								<th>Получатель</th>
								<th />
							</tr>
							<tr v-for="pack of shippedPackages" :key="pack['Номер']">
								<td>{{ pack['Дата'] }}</td>
								<td>{{pack['ТипДоставки']}}</td>
								<td>{{pack['Трек']}}</td>
								<td>{{pack['ОбщийВес']}} кг</td>
								<td>{{pack['ОбщаяЦенность']}} $</td>
								<td>{{pack['Получатель']}}</td>
								<td class="text-nowrap">
									<b-button size="sm" variant="info" class="mx-1" :to="`package-details/${pack['Номер']}`">
										<b-icon icon="eye-fill"/>
									</b-button>
								</td>
							</tr>
						</table>
					</div>
				</b-card-text>
			</b-tab>
		</b-tabs>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				activeTab: 0,
				packages: [],
				selectedPackages: []
			}
		},
		async mounted() {
			this.getPackages()
		},
		methods: {
			async getPackages() {
				const dateRange = {
					startDate: '',
					endDate: '',
				}

				this.loading = true

				try {
					const packages = await this.$store.dispatch('getPackages', dateRange)
					packages.sort((a, b) => Number(b['Номер'].replace(/\D/g, '')) - Number(a['Номер'].replace(/\D/g, '')))
					this.packages = packages
				} catch (e) {} finally {
					this.loading = false
				}
			},
			async onDelete(packageId, orderId) {
				this.loading = true

				if (orderId) {
					try {
						await this.$store.dispatch('deleteOrder', orderId)
						this.$toast(`Заказ ${orderId} успешно удален!`)
					} catch (e) {
						this.loading = false
					} finally {}
				}

				try {
					await this.$store.dispatch('deletePackage', packageId)
					this.getPackages()
					this.$toast(`Посылка ${packageId} успешно удалена!`)
				} catch (e) {
					this.loading = false
				} finally {}
			},
		},
		computed: {
			processedPackages() {
				return this.packages.filter(pack => pack['Статус'] !== 'Отправлена')
			},
			shippedPackages() {
				return this.packages.filter(pack => pack['Статус'] === 'Отправлена')
			},
		},
		components: {

		},
	}
</script>