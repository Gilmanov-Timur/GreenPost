<template>
	<b-modal
		id="modal-edit-order"
		centered
		scrollable
		no-close-on-backdrop
		no-close-on-esc
		size="lg"
		header-close-label="Закрыть"
		:title="selectedOrder ? `Редактирование заказа ${selectedOrder}` : 'Добавить новый заказ'"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
		@hide="onHide"
	>
		<template v-slot:default>
			<Loader v-if="loading" />
			<b-form @submit.prevent="onSubmit" ref="form">
				<div class="form-group px-3 py-2 border border-info rounded-pill">
					<div class="d-inline-block mr-2 mb-1">
						<b-form-checkbox size="lg" v-model="form.readyToShip" switch>
							<small>Отправить в один клик</small>
						</b-form-checkbox>
					</div>
					<b-icon icon="question-circle" class="my-1 align-middle" v-b-tooltip.hover title="Активируйте флажок, если желаете при поступлении товара незамедлительно переслать посылку на Ваш адрес, без возможности объединить ее с другими товарами и без проверки вложения." />
				</div>

				<div class="form-row form-group">
					<label for="form-track-number" class="col-6 col-form-label">
						Номер для отслеживания <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="text"
							id="form-track-number"
							class="form-control"
							v-model.trim="form.trackNumber"
							v-mask="{regex: '\\S*'}"
						required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-product-name" class="col-6 col-form-label">
						Наименование товара <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-product-name" v-model="form.productName" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-product-count" class="col-6 col-form-label">
						Количество <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="text"
							id="form-product-count"
							class="form-control"
							v-model="form.productCount"
							v-mask="{alias: 'integer', min: 1, allowMinus: false, rightAlign: false}"
							required
						/>
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-product-price" class="col-6 col-form-label">
						Ценность в $ <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="text"
							id="form-product-price"
							class="form-control"
							ref="productPrice"
							v-model="form.productPrice"
							v-mask="{alias: 'numeric', digits: 2, allowMinus: false, rightAlign: false, placeholder: ''}"
							required
						/>
					</div>
				</div>

				<div class="form-group">
					<div class="d-inline-block mr-2 mb-1">
						<b-form-checkbox size="lg" v-model="form.battery" switch>
							<small>Товар с батарейками/жидкостями/порошками?</small>
						</b-form-checkbox>
					</div>
					<b-icon icon="question-circle" class="my-1 align-middle" v-b-tooltip.hover title="Тип доставки зависит от опасности перевозимых товаров." />
				</div>

				<div class="form-group">
					<label for="form-product-image">Ссылка на фотографию товара</label>
					<b-input-group>
						<b-input
							id="form-product-image"
							v-model.trim="form.productImage"
						/>
						<b-input-group-append>
							<b-button size="sm" variant="info" class="ml-1" :disabled="!form.productImage" :href="form.productImage" target="_blank">
								<b-icon icon="eye-fill"/>
							</b-button>
						</b-input-group-append>
					</b-input-group>
				</div>

				<div class="form-group">
					<label for="form-comment" class="d-block">Комментарий к заказу</label>
					<b-form-textarea
						id="form-comment"
						v-model="form.comment"
						rows="3"
						max-rows="6"
						placeholder="Склад не видит этот комментарий! Заполняйте только для вашего личного использования в кабинете."
					/>
				</div>

				<b-button
					variant="info"
					class="mb-1"
					:class="servicesVisible ? null : 'collapsed'"
					@click="servicesVisible = !servicesVisible"
				>
					Дополнительные услуги
					<b-icon icon="chevron-up" v-if="servicesVisible"/>
					<b-icon icon="chevron-down" v-else />
				</b-button>
				<b-collapse id="services" v-model="servicesVisible">
					<b-card no-body class="p-2">
						<div class="form-group">
							<div class="d-inline-block mr-2 mb-1">
								<b-form-checkbox size="lg" v-model="form.check" switch :disabled="form.readyToShip">
									<small>Проверка на соответствие?</small>
								</b-form-checkbox>
							</div>
							<span class="text-danger align-middle">0.5$/кг</span>
						</div>

						<div class="form-group">
							<div class="d-inline-block mr-2 mb-1">
								<b-form-checkbox size="lg" v-model="form.photoReport" switch :disabled="!form.check">
									<small>Фотоотчёт?</small>
								</b-form-checkbox>
							</div>
							<span class="text-danger align-middle">1$/шт</span>
						</div>

						<div class="form-group">
							<div class="d-inline-block mr-2 mb-1">
								<b-form-checkbox size="lg" v-model="form.originalPackage" switch>
									<small>Оставить оригинальную упаковку?</small>
								</b-form-checkbox>
							</div>
							<span class="text-success align-middle">бесплатно</span>
						</div>

						<div class="form-group">
							<div class="d-inline-block mr-2 mb-1">
								<b-form-checkbox size="lg" v-model="form.repack" switch :disabled="!form.readyToShip">
									<small>Переупаковать?</small>
								</b-form-checkbox>
							</div>
							<span class="text-danger align-middle">0.4$/кг</span>
						</div>
					</b-card>
				</b-collapse>

				<button type="submit" class="d-none" ref="submitButton" />
			</b-form>
		</template>
		<template v-slot:modal-footer>
			<div class="w-100">
				<b-button variant="success" :disabled="loading" @click.prevent="onSave">
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
				servicesVisible: false,
				form: {
					productId: '',
					trackNumber: '',
					productName: '',
					productCount: '',
					productPrice: '',
					productImage: '',
					comment: '',
					packageId: '',
					battery: false,
					check: false,
					photoReport: false,
					originalPackage: false,
					readyToShip: false,
					repack: false,
				},
			}
		},
		props: ['selectedOrder'],
		mounted() {

		},
		methods: {
			onShow() {
				this.resetForm()
				this.getOrderData()
			},
			async getOrderData() {
				if (!this.selectedOrder) {
					return
				}

				this.loading = true

				try {
					const response = await this.$store.dispatch('getOrderDetails', this.selectedOrder)
					const options = this.transformOptions(response['ДополнительныеУслуги'])

					this.form.productId = response['Номер']
					this.form.trackNumber = response['Трек']
					this.form.productName = response['ВидТовара']
					this.form.productCount = response['Количество']
					this.form.productPrice = response['Ценность']
					this.form.productImage = response['Фото']
					this.form.comment = response['Комментарий']
					this.form.packageId = response['Посылка']
					this.form.battery = response['СодержитБатареи']
					this.form.check = !!options.check
					this.form.photoReport = !!options.photoReport
					this.form.originalPackage = !!options.originalPackage
					this.form.readyToShip = response['ОтправитьСразу']
					this.form.repack = !!options.repack
				} catch (e) {
					this.$bvModal.hide('modal-edit-order')
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
					'НомерЗаказа': this.form.productId,
					'НомерСклада': '000000001',
					'Трек': this.form.trackNumber,
					'ВидТовара': this.form.productName,
					'КатегорияТовара': '',
					'Количество': this.form.productCount,
					'Ценность': this.form.productPrice,
					'Фото': this.form.productImage,
					'Комментарий': this.form.comment,
					'СодержитБатареи': this.form.battery,
					"ПроверкаНаСоответсвие": this.form.check,
					"Фотоотчет": this.form.photoReport,
					"ОставитьФаричнуюУпаковку": this.form.originalPackage,
					// "ГотовыйГруз": false,
					"ОтправитьСразу": this.form.readyToShip,
					"ПереУпаковать": this.form.repack,
					// "Посылка": true,
					"Услуги": []
				}

				if (this.form.readyToShip && !this.form.packageId) {
					this.$emit('createPackage', formData)
					return
				}

				this.loading = true

				if (!this.form.readyToShip && this.form.packageId) {
					try {
						await this.$store.dispatch('deletePackage', this.form.packageId)
						this.$toast(`Посылка ${this.form.packageId} успешно удалена!`)
					} catch (e) {
						this.loading = false
					} finally {}
				}

				try {
					const response = await this.$store.dispatch('updateOrder', formData)
					this.$bvModal.hide('modal-edit-order')
					this.$emit('reloadOrders')
					this.$toast(this.selectedOrder ? `Заказ ${this.selectedOrder} успешно отредактирован!` : `Заказ ${response['НомерЗаказа']} успешно создан!`)
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			resetForm() {
				this.form.productId = ''
				this.form.trackNumber = ''
				this.form.productName = ''
				this.form.productCount = ''
				this.form.productPrice = ''
				this.form.productImage = ''
				this.form.comment = ''
				this.form.packageId = ''
				this.form.battery = false
				this.form.check = false
				this.form.photoReport = false
				this.form.originalPackage = false
				this.form.readyToShip = false
				this.form.repack = false
			},
			async onHide() {
				await this.$store.dispatch('cancelRequest')
			},
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
		},
		computed: {
			userId() {
				return this.$store.getters.userInfo['ID']
			},
		},
		watch: {
			'form.check': function (checked) {
				if (!checked) {
					this.form.photoReport = false
				}
			},
			'form.readyToShip': function (checked) {
				if (checked) {
					this.form.check = false
				} else {
					this.form.repack = false
				}
			}
		}
	}
</script>
