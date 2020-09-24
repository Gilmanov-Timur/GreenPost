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
						<table class="table table-sm table-bordered">
							<thead>
								<tr class="table-info">
									<th class="align-middle py-2">Дата</th>
									<th class="align-middle py-2">Тип доставки</th>
									<th class="align-middle py-2">Номер посылки</th>
									<th class="align-middle py-2">Вес</th>
									<th class="align-middle py-2">Ценность</th>
									<th class="align-middle py-2">Получатель</th>
									<th class="align-middle py-2">Статус</th>
									<th width="1" />
								</tr>
							</thead>
							<tbody>
								<tr v-for="pack of processedPackages" :key="pack['Номер']">
									<td class="align-middle">{{ pack['Дата'] }}</td>
									<td class="align-middle">{{pack['ТипДоставки']}}</td>
									<td class="align-middle">{{pack['Номер']}}</td>
									<td class="align-middle text-nowrap">{{pack['ОбщийВес']}} кг</td>
									<td class="align-middle text-nowrap">{{pack['ОбщаяЦенность']}} $</td>
									<td class="align-middle">{{pack['Получатель']}}</td>
									<td class="align-middle">{{pack['Статус']}}</td>
									<td class="align-middle text-nowrap">
										<b-button size="sm" variant="info" class="mx-1" :to="`package-details/${pack['Номер']}`">
											<b-icon icon="eye-fill"/>
										</b-button>
										<b-button
											size="sm"
											variant="danger"
											class="mx-1"
											:disabled="loading"
											@click.prevent="() => onDelete(pack['Номер'], pack['НомерГотовыйГруз'])"
											v-if="pack['Статус'] === 'В обработке'"
										>
											<b-icon icon="trash"/>
										</b-button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</b-card-text>
			</b-tab>

			<b-tab title="На доставке">
				<b-card-text>
					<div class="table-responsive">
						<table class="table table-sm table-bordered table-striped">
							<thead>
								<tr class="table-info">
									<th class="align-middle py-2">Дата</th>
									<th class="align-middle py-2">Тип доставки</th>
									<th class="align-middle py-2">Рейс</th>
									<th class="align-middle py-2">Номер отслеживания</th>
									<th class="align-middle py-2">Вес</th>
									<th class="align-middle py-2">Ценность</th>
									<th class="align-middle py-2">Получатель</th>
									<th class="align-middle py-2">Стоимость доставки</th>
									<th width="1" />
								</tr>
							</thead>
							<tbody>
								<tr v-for="pack of shippedPackages" :key="pack['Номер']">
									<td class="align-middle">{{ pack['Дата'] }}</td>
									<td class="align-middle">{{pack['ТипДоставки']}}</td>
									<td class="align-middle">{{pack['Рейс']}}</td>
									<td class="align-middle">{{pack['Трек']}}</td>
									<td class="align-middle text-nowrap">{{pack['ОбщийВес']}} кг</td>
									<td class="align-middle text-nowrap">{{pack['ОбщаяЦенность']}} $</td>
									<td class="align-middle">{{pack['Получатель']}}</td>
									<td class="align-middle text-nowrap">
										{{ pack['ЦенаПосылки'] !== '' ? pack['ЦенаПосылки'].toFixed(2) + ' $' : '' }}
									</td>
									<td class="align-middle text-nowrap">
										<b-button size="sm" variant="info" class="mx-1" :disabled="loading" :to="`package-details/${pack['Номер']}`">
											<b-icon icon="eye-fill"/>
										</b-button>
									</td>
								</tr>
							</tbody>
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
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
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
				this.$bvModal.msgBoxConfirm('Вы действительно хотите удалить эту посылку?', {
					title: `Удалить посылку ${packageId}`,
					headerBgVariant: 'info',
					headerTextVariant: 'white',
					footerBgVariant: 'light',
					okVariant: 'danger',
					okTitle: 'Да',
					cancelTitle: 'Нет',
					hideHeaderClose: false,
					centered: true
				})
				.then(async confirm => {
					if (!confirm) {
						return
					}

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
						try {
							await this.$store.dispatch('getUserInfo')
						} catch (e) {}
					} catch (e) {
						this.loading = false
					} finally {}
				})
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