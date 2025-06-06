<template>
	<div>
		<div class="row">
			<div class="col">
				<h2 class="mb-4">Посылки</h2>
			</div>
		</div>

		<Loader v-if="loading" />

		<b-card-text>
			<div class="table-responsive">
				<table class="table table-sm table-bordered table-striped">
					<thead>
						<tr class="table-info">
							<th class="align-middle py-2">Дата</th>
							<th class="align-middle py-2">Рейс</th>
							<th class="align-middle py-2">Номер посылки</th>
							<th class="align-middle py-2">Номер отслеживания</th>
							<th class="align-middle py-2">Статус</th>
							<th class="align-middle py-2">Вес</th>
							<th class="align-middle py-2">Объемный вес</th>
							<th class="align-middle py-2">Ценность</th>
							<th class="align-middle py-2">Получатель</th>
							<th class="align-middle py-2">Статус</th>
							<th class="align-middle py-2">Стоимость доставки</th>
							<th class="align-middle py-2">Долг посылки</th>
							<th width="1" />
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="pack in packages"
							:key="pack['Номер']"
							:class="{'table-orange': pack['Объемный'] > pack['ОбщийВес']}"
						>
							<td class="align-middle">{{ pack['Дата'] }}</td>
							<td class="align-middle">{{pack['Рейс']}}</td>
							<td class="align-middle">{{pack['Номер']}}</td>
							<td class="align-middle">{{pack['Трек']}}</td>
							<td class="align-middle">{{pack['Статус']}}</td>
							<td class="align-middle text-nowrap">{{pack['ОбщийВес']}} кг</td>
							<td class="align-middle text-nowrap">{{pack['Объемный']}} кг</td>
							<td class="align-middle text-nowrap">{{pack['ОбщаяЦенность']}} $</td>
							<td class="align-middle">{{pack['Получатель']}}</td>
							<td class="align-middle">{{pack['Статус']}}</td>
							<td class="align-middle text-nowrap">
								{{ pack['ЦенаПосылки'] !== '' ? pack['ЦенаПосылки'].toFixed(2) + ' $' : '' }}
							</td>
							<td class="align-middle text-nowrap">
								{{ pack['ДолгПосылки'] !== '' ? pack['ДолгПосылки'].toFixed(2) + ' $' : '' }}
							</td>
							<td class="align-middle text-nowrap">
								<b-button size="sm" variant="info" class="mx-1" :disabled="loading" :to="`package-details/${pack['Номер']}`">
									<b-icon icon="eye-fill"/>
								</b-button>
								<b-button
									size="sm"
									variant="danger"
									class="mx-1"
									:disabled="loading"
									@click.prevent="() => onDelete(pack['Номер'], pack['НомерГотовыйГруз'])"
									v-if="pack['Статус'] === 'В ожидании'"
								>
									<b-icon icon="trash"/>
								</b-button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</b-card-text>

		<div class="d-inline-block d-md-block">
			<div>
				<span class="h5"><b-badge class="table-orange" v-html="'&ensp;'"/></span>
				- Объемный вес больше фактического
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				packages: [],
				selectedPackages: []
			}
		},
		async mounted() {
			await this.getPackages()
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
					this.packages = await this.$store.dispatch('getPackages', dateRange)
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
						await this.getPackages()
						this.$toast(`Посылка ${packageId} успешно удалена!`)
						await this.$store.dispatch('getUserInfo')
					} catch (e) {
						this.loading = false
					} finally {}
				})
			},
			parseDeliveryMethod(name) {
				const id = this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Наименование'] === name)?.['Код']
				switch(id) {
					case '000000001': return 'Авиа';
					case '000000004': return 'Авиа SG';
					case '000000006': return 'Авиа Express';
					case '000000009': return 'Cargo';
					case '000000010': return 'Cargo';
				}
			}
		},
		computed: {
			serviceInfo() {
				return this.$store.getters.serviceInfo
			},
			processedPackages() {
				return this.packages.filter(pack => !['Отправлена', 'На ММПО в Ташкенте', 'Доставлена'].includes(pack['Статус']))
			},
			shippedPackages() {
				return this.packages.filter(pack => ['Отправлена', 'На ММПО в Ташкенте', 'Доставлена'].includes(pack['Статус']))
			},
		},
	}
</script>
