<template>
	<b-modal
		id="modal-new-package"
		centered
		scrollable
		no-close-on-backdrop
		no-close-on-esc
		size="lg"
		header-close-label="Закрыть"
		title="Оформить новую посылку"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
		@hide="onHide"
	>
		<template v-slot:default>
			<Loader v-if="loading" />

			<b-form @submit.prevent="onSubmit">
				<div class="row">
					<div class="col">
						<div class="form-group">
							<label for="form-recipient">
								Получатель
							</label>
							<b-input-group>
								<b-form-select
									id="form-recipient"
									v-model="form.recipient"
									:options="recipientOptions"
									required
								/>
							</b-input-group>
						</div>
					</div>
					<div class="col-auto">
						<label>
							Новый получатель
						</label>
						<b-input-group>
							<b-button variant="info" @click.prevent="onNewRecipient">
								<BIconPlusCircle/> Добавить
							</b-button>
						</b-input-group>
					</div>
				</div>

				<div class="form-group">
					<label for="form-delivery-method">
						Способ доставки
					</label>
					<b-input-group>
						<b-form-select
							id="form-delivery-method"
							v-model="form.deliveryMethod"
							:options="deliveryMethodOptions"
							:disabled="deliveryMethodOptions.length === 1"
							required
						/>
					</b-input-group>
				</div>

				<div class="form-group">
					<label for="form-delivery-point">
						Доставить до
					</label>
					<b-input-group>
						<b-form-select
							id="form-delivery-point"
							v-model="form.deliveryPoint"
							:options="deliveryPointOptions"
							required
						/>
					</b-input-group>
				</div>

				<button type="submit" class="d-none" ref="submitButton" />
			</b-form>
		</template>
		<template v-slot:modal-footer>
			<div class="w-100">
				<b-button variant="success" :disabled="!recipientOptions.length || loading" @click.prevent="onSave">
					Сохранить
				</b-button>
			</div>
		</template>
	</b-modal>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				form: {
					recipient: null,
					deliveryPoint: null,
					deliveryMethod: null,
				},
				recipientOptions: [],
				deliveryPointOptions: [
					{
						value: '000000001', text: 'Отделение GreenPost, г. Ташкент',
					},
					{
						value: '000000003', text: 'Адресная доставка, г. Ташкент',
					},
					{
						value: '000000004', text: 'Адресная доставка, регионы',
					},
				],
			}
		},
		props: ['checkedOrders', 'newOrderData', 'timestamp'],
		mounted() {

		},
		methods: {
			onShow() {
				this.resetForm()
				this.getRecipients()
			},
			async onHide() {
				await this.$store.dispatch('cancelRequest')
			},
			resetForm() {
				this.form.recipient = null
				this.recipientOptions = []
				// this.form.recipient = this.recipientOptions[0] && this.recipientOptions[0].value
				this.form.deliveryPoint = this.deliveryPointOptions[0].value
				this.form.deliveryMethod = this.deliveryMethodOptions[0].value
			},
			async getRecipients() {
				this.loading = true

				try {
					const recipients = await this.$store.dispatch('getRecipients')
					this.recipientOptions = recipients.map(recipient => {
						return {
							value: recipient['Номер'],
							text: `${recipient['ФИО']}, ${recipient['Улица']}, ${recipient['Дом']}${recipient['Квартира'] ? ('-' + recipient['Квартира']) : ''}`
						}
					})
					this.form.recipient = this.recipientOptions[0] && this.recipientOptions[0].value
				} catch (e) {
					this.$bvModal.hide('modal-new-package')
				} finally {
					this.loading = false
				}
			},
			onSubmit() {
				this.submitForm()
			},
			onSave() {
				this.$refs.submitButton.click()
			},
			async submitForm() {
				const formData = {
					'НомерПосылки': '',
					"НомерПолучателя": this.form.recipient,
					'НомерСклада': '000000001',
					'НомерВидаПеревозок': this.form.deliveryMethod,
					'НомерУслугиПосылки': this.form.deliveryPoint,
					'НомераЗаказов': this.checkedOrders.map(order => order['Номер'])
				}

				this.loading = true

				if (this.newOrderData) {
					try {
						const response = await this.$store.dispatch('updateOrder', this.newOrderData)
						formData['НомераЗаказов'] = [response['НомерЗаказа']]
						this.$toast(`Заказ ${response['НомерЗаказа']} успешно создан!`)
					} catch (e) {
						this.loading = false
					} finally {}
				}

				try {
					const response = await this.$store.dispatch('updatePackage', formData)
					this.$bvModal.hide('modal-new-package')
					this.$bvModal.hide('modal-edit-order')
					this.$emit('reloadOrders')
					this.$toast(`Посылка ${response['НомерПосылки']} успешно создана!`)
					try {
						await this.$store.dispatch('getUserInfo')
					} catch (e) {}
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			onNewRecipient() {
				this.$bvModal.show('modal-edit-recipient')
			}
		},
		computed: {
			deliveryMethodOptions() {
				let battery
				const deliveryMethods = []

				if (this.newOrderData) {
					battery = this.newOrderData['СодержитБатареи']
				} else {
					battery = this.checkedOrders.find(order => order['СодержитБатареи'])
				}

				if (battery) {
					deliveryMethods.push({
						value: '000000004',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000004')['Наименование']
					})
				} else {
					deliveryMethods.push({
						value: '000000006',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000006')['Наименование']
					})
					deliveryMethods.push({
						value: '000000001',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000001')['Наименование']
					})
				}

				return deliveryMethods
			},
			serviceInfo() {
				return this.$store.getters.serviceInfo
			},
		},
		watch: {
			timestamp: function () {
				this.getRecipients()
			},
		}
	}
</script>
