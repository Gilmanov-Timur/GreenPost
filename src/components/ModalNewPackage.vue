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
				<div class="form-row form-group align-items-end">
					<div class="col">
						<label for="form-recipient">
							Получатель
						</label>
						<b-input-group>
							<b-form-select
								id="form-recipient"
								v-model="form.recipientId"
								:options="recipientOptions"
								required
							/>
						</b-input-group>
					</div>
					<div class="col-auto">
						<b-button variant="info" @click.prevent="onEditRecipient">
							<b-icon icon="pencil-square"/>
							<span class="d-none d-lg-inline-block ml-2">Редактировать</span>
						</b-button>
					</div>
					<div class="col-auto">
						<b-button variant="info" @click.prevent="onNewRecipient">
							<BIconPlusCircle/>
							<span class="d-none d-lg-inline-block ml-2">Добавить</span>
						</b-button>
					</div>
				</div>

				<div class="alert alert-danger" v-if="!isRecipientPinflValid">
					У выбранного получателя не указан ПИНФЛ
					<BIconQuestionCircle
						class="cursor-pointer"
						@click="$bvModal.show('modal-pinfl')"
					/>
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
					<b-alert class="mt-2 px-3" style="white-space:pre-line" show>
						{{ serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === form.deliveryMethod)['Комментарий'] }}
					</b-alert>
				</div>

				<div class="form-group">
					<label for="form-delivery-point">
						Куда доставить
					</label>
          <b-form-select
            id="form-delivery-point"
            v-model="form.deliveryPoint"
            :options="deliveryPointOptions"
            required
          />
				</div>

        <div
          v-if="form.deliveryPoint === 'Fillial'"
          class="form-group"
        >
          <label for="filial-select">
            Выберите филиал
          </label>
          <b-form-select
            id="filial-select"
            v-model="form.filialCode"
            :options="filialOptions"
            required
          />
          <div v-if="selectedFilialAddress" class="pt-1">
            {{ selectedFilialAddress }}
          </div>
        </div>

        <div
          v-if="form.deliveryPoint === 'Taskent'"
          class="form-group"
        >
          <label for="delivery-address">
            Введите адрес
          </label>
          <b-input
            id="delivery-address"
            v-model="form.deliveryAddress"
            required
          />
        </div>

        <template v-if="form.deliveryPoint === 'Region'">
          <div class="form-group">
            <label for="region-select">
              Выберите регион
            </label>
            <b-form-select
              id="region-select"
              v-model="form.regionCode"
              :options="regionOptions"
              required
              @change="form.pickupPointCode = null"
            />
          </div>

          <div
            v-if="form.regionCode"
            class="form-group"
          >
            <label for="pickup-point-select">
              Выберите пункт выдачи
            </label>
            <b-form-select
              id="pickup-point-select"
              v-model="form.pickupPointCode"
              :options="pickupPointOptions"
              required
            />
            <div v-if="selectedPickupPointAddress" class="pt-1">
              {{ selectedPickupPointAddress }}
            </div>
          </div>
        </template>

				<button type="submit" class="d-none" ref="submitButton" />
			</b-form>
		</template>
		<template v-slot:modal-footer>
			<div class="w-100">
				<b-button
					variant="success"
					:disabled="!recipientOptions.length || !isRecipientPinflValid || loading"
					@click.prevent="onSave"
				>
					Оформить
				</b-button>
			</div>
		</template>
	</b-modal>
</template>

<script>
import { isPinflCorrect, getBirthdateFromPinfl } from '@/utils/functions'
	export default {
		data() {
			return {
				loading: false,
				recipients: [],
				form: {
					recipientId: null,
					deliveryPoint: null,
					deliveryMethod: null,
          filialCode: null,
          deliveryAddress: null,
          regionCode: null,
          pickupPointCode: null,
				},
				recipientOptions: [],
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
				this.form.recipientId = null;
				this.recipientOptions = [];
				this.form.deliveryPoint = this.deliveryPointOptions[0].value;
				this.form.deliveryMethod = this.deliveryMethodOptions[0].value;
        this.form.filialCode = null;
        this.form.deliveryAddress = null;
        this.form.regionCode = null;
        this.form.pickupPointCode = null;
			},
			async getRecipients() {
				this.loading = true

				try {
					const recipients = await this.$store.dispatch('getRecipients')
					this.recipients = recipients
					this.recipientOptions = recipients.map(recipient => {
						return {
							value: recipient['Номер'],
							text: recipient['ФИО']
						}
					})
					if (!this.form.recipientId) {
						this.form.recipientId = this.recipientOptions[0] && this.recipientOptions[0].value
					}
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
					"НомерПолучателя": this.form.recipientId,
					'НомерСклада': '000000001',
					'НомерВидаПеревозок': this.form.deliveryMethod,
					'НомераЗаказов': this.checkedOrders?.map(order => order['Номер']) || ''
				}

        if (this.form.deliveryPoint === 'Taskent') {
          formData['НомерУслугиПосылки'] = this.deliveryPoints?.Taskent.code;
          formData['АдресПосылки'] = this.form.deliveryAddress?.trim();
        } else if (this.form.deliveryPoint === 'Region') {
          formData['НомерУслугиПосылки'] = this.form.pickupPointCode;
          formData['АдресПосылки'] = this.selectedPickupPointAddress?.trim();
        } else {
          formData['НомерУслугиПосылки'] = this.form.filialCode;
          formData['АдресПосылки'] = this.selectedFilialAddress?.trim();
        }

				this.loading = true

				try {
					if (!this.selectedRecipient['ДатаРождения']) {
						await this.$store.dispatch('updateRecipient', {
							'ФИО': this.selectedRecipient['ФИО'],
							'НомерПолучателя': this.selectedRecipient['Номер'],
							'НомерСтраны': '000000001',
							// 'Область': this.selectedRecipient['Область'],
							// 'Город': this.selectedRecipient['Город'],
							// 'Улица': this.selectedRecipient['Улица'],
							// 'Дом': this.selectedRecipient['Дом'],
							// 'Квартира': this.selectedRecipient['Квартира'] || '',
							'Телефон': this.selectedRecipient['Телефон'],
							'СерияНомерПаспорта': this.selectedRecipient['СерияНомерПаспорта'],
							'ПИНФЛ': this.selectedRecipient['ПИНФЛ'],
							'ДатаРождения': getBirthdateFromPinfl(this.selectedRecipient['ПИНФЛ']),
						})
					}

					if (this.newOrderData) {
						const response = await this.$store.dispatch('updateOrder', this.newOrderData)
						formData['НомераЗаказов'] = [response['НомерЗаказа']]
						this.$toast(`Заказ ${response['НомерЗаказа']} успешно создан!`)
					}

					const response = await this.$store.dispatch('updatePackage', formData)
					this.$bvModal.hide('modal-new-package')
					this.$bvModal.hide('modal-edit-order')
					this.$emit('reloadOrders')
					this.$toast(`Посылка ${response['НомерПосылки']} успешно создана!`)
					await this.$store.dispatch('getUserInfo')
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			onNewRecipient() {
				this.$bvModal.show('modal-edit-recipient')
			},
			onEditRecipient() {
				this.$emit('editRecipient', this.selectedRecipient)
			},
		},
		computed: {
			categoriesList() {
				return this.$store.getters.categoriesList
			},
      deliveryPoints() {
        return this.$store.getters.deliveryPoints
      },
			deliveryMethodOptions() {
				const subcategory = !!this.newOrderData
					? this.categoriesList?.map(category => category['Подкатегории']).flat().find(subcategory => subcategory['УИДПодкатегории'] === this.newOrderData['УИДПодкатегории'])
					: null
				const hasBattery = !!this.newOrderData
					? this.newOrderData['СодержитБатареи'] || subcategory?.DG
					: this.checkedOrders.some(order => order['СодержитБатареи'])
        const hasBrandCopy = !!this.newOrderData && this.newOrderData['КопииBRAND']
          || !this.newOrderData && this.checkedOrders.some(order => order['ДополнительныеУслуги'].includes('Копии BRAND'))

        if (hasBattery) {
          return [
            { // АВТО Почта
              value: '000000003',
              text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000003')['Наименование']
            },
            { // Cargo Commerce
              value: '000000009',
              text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000009')['Наименование']
            },
          ]
        } else if (hasBrandCopy) {
          return [
            { // Авиа ТК Почта
              value: '000000006',
              text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000006')['Наименование']
            },
            { // АВТО Почта
              value: '000000003',
              text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000003')['Наименование']
            },
            { // Cargo commerce
              value: '000000010',
              text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000010')['Наименование']
            },
          ]
        }

        return [
          { // Авиа Почта
            value: '000000001',
            text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000001')['Наименование']
          },
          { // АВТО Почта
            value: '000000003',
            text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000003')['Наименование']
          },
          { // Cargo commerce
            value: '000000010',
            text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000010')['Наименование']
          },
        ]
			},
			serviceInfo() {
				return this.$store.getters.serviceInfo
			},
			selectedRecipient() {
				return this.recipients?.find(recipient => recipient['Номер'] === this.form.recipientId)
			},
			isRecipientPinflValid() {
				if (this.recipients.length && this.form.recipientId) {
					const pinfl = this.selectedRecipient['ПИНФЛ']
					return isPinflCorrect(pinfl)
				} else {
					return true
				}
			},
			deliveryPointOptions() {
				return [
          {
            text: 'До филиала',
            value: 'Fillial',
          },
          {
            text: 'По адресу г. Ташкент',
            value: 'Taskent',
          },
          {
            text: 'По областям Узбекистана',
            value: 'Region',
          },
        ];
			},
      filialOptions() {
        return this.deliveryPoints?.Fillial.map(filial => ({
          text: filial.name,
          value: filial.code
        })) || []
      },
      selectedFilialAddress() {
        return this.deliveryPoints?.Fillial.find(filial => filial.code === this.form.filialCode)?.address
      },
      regionOptions() {
        return this.deliveryPoints?.Region.map(filial => ({
          text: filial.name,
          value: filial.code
        })) || []
      },
      pickupPointOptions() {
        const pickupPoints = this.deliveryPoints?.Region.find(region => region.code === this.form.regionCode)?.data

        return pickupPoints?.map(point => ({
          text: point.name,
          value: point.code
        })) || []
      },
      selectedPickupPointAddress() {
        return this.deliveryPoints?.Region.map(region => region.data).flat().find(point => point.code === this.form.pickupPointCode)?.address
      }
		},
		watch: {
			timestamp: function () {
				this.getRecipients()
			},
		}
	}
</script>
