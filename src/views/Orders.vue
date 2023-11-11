<i18n lang="json5">{
	ru: {
		test: 'Тестовый текст',
	},
	uz: {
		test: 'Test message',
	}
}</i18n>

<template>
	<div>
		<div class="row">
			<div class="col">
				<h2 class="mb-4">Товары</h2>
			</div>
			<div class="col-auto">
				<b-button size="lg" variant="success" @click.prevent="onNewOrder">
					<BIconPlusCircle/> Новый товар
				</b-button>
			</div>
		</div>

		<Loader v-if="loading" />

		<b-tabs card active-nav-item-class="text-success" v-model="activeTab" @input="onTabChange">
			<b-tab title="Купленные">
				<b-card-text>
					<div class="table-responsive">
						<table class="table table-sm table-bordered">
							<tr class="table-info">
								<th class="align-middle py-2">Тип груза</th>
								<th class="align-middle py-2">Дата</th>
								<th class="align-middle py-2">Наименование товара</th>
								<th class="align-middle py-2">Кол-во</th>
								<th class="align-middle py-2">Ценность</th>
								<th class="align-middle py-2">Номер отслеживания</th>
								<th class="align-middle py-2">Комментарий</th>
								<th width="1" class="align-middle py-2 text-nowrap">Услуги</th>
								<th width="1" />
							</tr>
							<tr v-for="order of purchasedOrders" :key="order['Номер']">
								<td class="align-middle text-center">
									<IconConsolidation v-if="order['ТипГруза'] !== 1" />
									<span title="Готовый груз" v-else>
										<BIconBox icon="box" font-scale="1.5" variant="success" class="my-n1" />
									</span>
								</td>
								<td class="align-middle">{{order['Дата']}}</td>
								<td class="align-middle">{{order['НаименованиеТовара'] || order['ВидТовара']}}</td>
								<td class="align-middle">{{order['Количество']}}</td>
								<td class="align-middle text-nowrap">{{order['Ценность']}}$</td>
								<td class="align-middle">{{order['ТрекПоступления']}}</td>
								<td class="align-middle">{{order['Комментарий']}}</td>
								<td class="align-middle text-nowrap">
									<span class="mx-1" title="Проверка на соответствие" v-if="order.check">
										<BIconSearch icon="search" font-scale="1.5" />
									</span>
									<span class="mx-1" title="Фотоотчет" v-if="order.photoReport">
										<BIconCamera icon="camera" font-scale="1.5" />
									</span>
									<span class="mx-1" title="Переупаковка" v-if="order.repack">
										<BIconBoxSeam icon="box-seam" font-scale="1.5" />
									</span>
								</td>
								<td class="align-middle text-nowrap">
									<b-button size="sm" variant="primary" class="mx-1" :disabled="loading" :to="`order-details/${order['Номер']}?tab=${activeTab}`">
										<BIconEyeFill/>
									</b-button>

									<b-button size="sm" variant="info" class="mx-1" :disabled="loading" @click.prevent="() => onEdit(order['Номер'])">
										<BIconPencilSquare/>
									</b-button>

									<b-button size="sm" variant="danger" class="mx-1" :disabled="loading" @click.prevent="() => onDelete(order['Номер'], order['Посылка'])">
										<BIconTrash/>
									</b-button>
								</td>
							</tr>
						</table>
					</div>
				</b-card-text>
			</b-tab>

			<b-tab title="На складе">
				<div class="table-responsive">
					<table class="table table-sm table-bordered">
						<tr class="table-info">
							<th width="1" class="align-middle py-2 text-nowrap">Выбор</th>
							<th class="align-middle py-2">Тип груза</th>
							<th class="align-middle py-2">Дата</th>
							<th class="align-middle py-2">Наименование товара</th>
							<th class="align-middle py-2">Кол-во</th>
							<th class="align-middle py-2">Ценность</th>
							<th class="align-middle py-2">Вес</th>
							<th class="align-middle py-2">Объемный вес</th>
							<th class="align-middle py-2">Номер отслеживания</th>
							<th class="align-middle py-2">Комментарий</th>
							<th width="1" class="align-middle py-2">Услуги</th>
							<th width="1" />
						</tr>
						<tr
							v-for="order of stockedOrders"
							:key="order['Номер']"
							:class="{
								'table-yellow': order['СодержитБатареи'],
								'table-orange': order['Объемный'] > order['Вес'],
								'table-red': order['Несоответствие'],
							}"
						>
							<td class="align-middle text-center">
								<div class="custom-control custom-checkbox b-custom-control-lg mr-n2">
									<input
										type="checkbox"
										:id="order['Номер']"
										class="custom-control-input"
										value="true"
										v-model="order.checked"
										:disabled="order.disabled"
									/>
									<label
										class="custom-control-label"
										:for="order['Номер']"
										:title="order.disabled ? 'Нельзя объединять простые товары с опасными в одну посылку' : ''"
									/>
								</div>
							</td>
							<td class="align-middle text-center">
								<IconConsolidation v-if="order['ТипГруза'] !== 1" />
								<span title="Готовый груз" v-else>
									<BIconBox font-scale="1.5" variant="success" class="my-n1" />
								</span>
							</td>
							<td class="align-middle">{{order['Дата']}}</td>
							<td class="align-middle">{{order['НаименованиеТовара'] || order['ВидТовара']}}</td>
							<td class="align-middle">{{order['Количество']}}</td>
							<td class="align-middle text-nowrap">{{order['Ценность']}}$</td>
							<td class="align-middle text-nowrap">{{order['Вес']}} кг</td>
							<td class="align-middle text-nowrap">{{order['Объемный']}} кг</td>
							<td class="align-middle">{{order['ТрекПоступления']}}</td>
							<td class="align-middle">{{order['Комментарий']}}</td>
							<td class="align-middle text-nowrap">
								<span class="mx-1" title="Проверка на соответствие" v-if="order.check">
									<BIconSearch icon="search" font-scale="1.5" />
								</span>
								<span class="mx-1" title="Фотоотчет" v-if="order.photoReport">
									<BIconCamera font-scale="1.5" />
								</span>
								<span class="mx-1" title="Переупаковка" v-if="order.repack">
									<BIconBoxSeam font-scale="1.5" />
								</span>
							</td>
							<td class="align-middle text-nowrap">
								<b-button size="sm" variant="primary" class="mx-1" :disabled="loading" :to="`order-details/${order['Номер']}?tab=${activeTab}`">
									<BIconEyeFill/>
								</b-button>
							</td>
						</tr>
					</table>
				</div>

				<div class="position-sticky float-right d-flex justify-content-end selected-orders mb-2 mb-md-0">
					<b-card bg-variant="light" border-variant="info" body-class="px-0 py-3" class="d-inline-block" v-if="checkedOrders.length">
						<div class="d-xl-flex my-n2">
							<div class="col-auto my-2">
								<table class="text-nowrap">
									<tr>
										<td class="pr-2">Общая ценность:</td>
										<td>
											<b>{{ checkedOrdersPrice }}</b>$
										</td>
									</tr>
									<tr>
										<td class="pr-2">Общий вес:</td>
										<td>
											<b>{{ checkedOrdersWeight }}</b> кг
										</td>
									</tr>
								</table>
							</div>
							<div class="col-auto my-2">
								<b-button size="lg" variant="success" class="text-nowrap" @click.prevent="() => createPackage()">
									Оформить посылку
								</b-button>
							</div>
						</div>
					</b-card>
				</div>

				<div class="d-inline-block d-md-block">
					<div>
						<span class="h5"><b-badge class="table-yellow" v-html="'&ensp;'"/></span>
						- Товар с батарейками/жидкостями/порошками/магнитами
					</div>
					<div>
						<span class="h5"><b-badge class="table-orange" v-html="'&ensp;'"/></span>
            			- Объемный вес больше фактического
					</div>
          			<div>
						<span class="h5"><b-badge class="badge-danger" v-html="'&ensp;'"/></span>
						- Выявленное несоответствие
					</div>
				</div>
			</b-tab>
		</b-tabs>

		<ModalEditOrder :selectedOrder="selectedOrder" @reloadOrders="getOrders" @createPackage="createPackage" />
		<ModalNewPackage
			:checkedOrders="checkedOrders"
			:newOrderData="newOrderData"
			:timestamp="timestamp"
			@reloadOrders="getOrders"
			@editRecipient="editRecipient"
		/>
		<ModalEditRecipient
			:selectedRecipient="selectedRecipient"
			@reloadRecipients="updateTimestamp"
			@hide="selectedRecipient = null"
		/>
	</div>
</template>

<script>
	/* eslint-disable */
	const IconConsolidation = {
		template: `
			<div class="d-inline-block" title="Консолидация">
				<b-iconstack font-scale="2">
					<BIconBox stacked variant="success" scale="0.55" shift-v="4" />
					<BIconBox stacked variant="success" scale="0.55" shift-v="-4" shift-h="5" />
					<BIconBox stacked variant="success" scale="0.55" shift-v="-4" shift-h="-5" />
				</b-iconstack>
			</div>
		`
	}

	export default {
		data() {
			return {
				loading: false,
				activeTab: this.$route.query && Number(this.$route.query.tab) || 0,
				orders: [],
				newOrderData: null,
				selectedOrder: null,
				selectedRecipient: null,
				timestamp: null,
			}
		},
		async mounted() {
			await this.getOrders()
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			async getOrders() {
				const dateRange = {
					startDate: '',
					endDate: '',
				}

				this.loading = true

				try {
					const orders = await this.$store.dispatch('getActiveOrders', dateRange)
					const filteredOrders = orders.filter(order => ['В ожидании', 'На складе'].includes(order['Статус']) && !order['ПометкаУдаления'])

					filteredOrders
						.sort((a, b) => Number(b['Номер'].replace(/\D/g, '')) - Number(a['Номер'].replace(/\D/g, '')))
						.forEach(order => {
							order.check = order['ДополнительныеУслуги'].includes('Проверить на соответствие')
							order.photoReport = order['ДополнительныеУслуги'].includes('Сделать фото товара и проверить по дополнительным комментариям')
							order.repack = order['ДополнительныеУслуги'].includes('Переупаковка')
						})
					this.orders = filteredOrders
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			onEdit(orderId) {
				this.selectedOrder = orderId
				this.showModal()
			},
			async onDelete(orderId, packageId) {
				this.$bvModal.msgBoxConfirm('Вы действительно хотите удалить этот товар?', {
					title: `Удалить товар ${orderId}`,
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

					if (packageId) {
						try {
							await this.$store.dispatch('deletePackage', packageId)
							this.$toast(`Посылка ${packageId} успешно удалена!`)
						} catch (e) {
							this.loading = false
						} finally {}
					}

					try {
						await this.$store.dispatch('deleteOrder', orderId)
						await this.getOrders()
						this.$toast(`Товар ${orderId} успешно удален!`)
					} catch (e) {
						this.loading = false
					} finally {}
				})
			},
			onNewOrder() {
				this.selectedOrder = null
				this.showModal()
			},
			createPackage(formData = null) {
				this.newOrderData = formData
				this.$nextTick(() => {
					this.$bvModal.show('modal-new-package')
				})
			},
			showModal() {
				this.$nextTick(() => {
					this.$bvModal.show('modal-edit-order')
				})
			},
			updateTimestamp() {
				this.timestamp = Date.now()
			},
			onTabChange(index) {
				this.$router.replace(`${this.$route.path}?tab=${index}`)
			},
			editRecipient(selectedRecipient) {
				this.selectedRecipient = selectedRecipient
				this.$nextTick(() => {
					this.$bvModal.show('modal-edit-recipient')
				})
			},
		},
		computed: {
			purchasedOrders() {
				return this.orders.filter(order => order['Статус'] === 'В ожидании')
			},
			stockedOrders() {
				return this.orders.filter(order => order['Статус'] === 'На складе')
			},
			checkedOrders() {
				return this.orders.filter(order => order['checked'])
			},
			checkedOrdersPrice() {
				return this.checkedOrders.reduce((sum, current) => sum + current['Ценность'], 0).toFixed(2)
			},
			checkedOrdersWeight() {
				return this.checkedOrders.reduce((sum, current) => sum + current['Вес'], 0).toFixed(2)
			},
		},
		watch: {
			checkedOrders: function (orders) {
				if (!orders.length) {
					this.stockedOrders.forEach(order => order.disabled = false)
					return
				}

				const battery = orders[0]['СодержитБатареи']
				this.stockedOrders.forEach(order => order.disabled = battery !== order['СодержитБатареи'])
			},
		},
		components: {
			'ModalEditOrder': require('@/components/ModalEditOrder.vue').default,
			'ModalNewPackage': require('@/components/ModalNewPackage.vue').default,
			'ModalEditRecipient': require('@/components/ModalEditRecipient.vue').default,
			'IconConsolidation': IconConsolidation
		},
	}
</script>
