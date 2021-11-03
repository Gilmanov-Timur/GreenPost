<template>
	<b-modal
		id="modal-edit-recipient"
		centered
		scrollable
		no-close-on-backdrop
		header-close-label="Закрыть"
		title="Добавить нового получателя"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
	>
		<template v-slot:default>
			<Loader v-if="loading" />
			<b-form @submit.prevent="onSubmit">
				<div class="form-row form-group">
					<label for="form-name" class="col-6 col-form-label">
						ФИО <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-name" v-model.trim="form.name" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-passport" class="col-6 col-form-label">
						Серия паспорта <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="text"
							id="form-passport"
							class="form-control"
							v-model="form.passport"
							v-mask="{mask: 'AA9999999', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
          <div class="col-12" v-if="isInternationalPassport">
            <div class="alert alert-danger mt-2 mb-0">
              Загранпаспорт не подходит для сервиса
            </div>
          </div>
				</div>

				<div class="form-row form-group">
					<label for="form-phone" class="col-6 col-form-label">
						Номер телефона <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="tel"
							id="form-phone"
							class="form-control"
							v-model="form.phone"
							v-mask="{mask: '+[999999999999]', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
				</div>

				<div class="form-group">
					<label for="form-region" class="d-block">
						Регион <span class="text-danger">*</span>
					</label>
					<b-form-select
						id="form-region"
						v-model="form.region"
						:options="regionOptions"
						required
					/>
				</div>

				<div class="form-row form-group">
					<label for="form-city" class="col-6 col-form-label">
						Город <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-city" v-model.trim="form.city" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-street" class="col-6 col-form-label">
						Улица <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-street" v-model.trim="form.street" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-house" class="col-6 col-form-label">
						Дом <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-house" v-model.trim="form.house" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-flat" class="col-6 col-form-label">
						Квартира
					</label>
					<div class="col">
						<b-input id="form-flat" v-model.trim="form.flat" />
					</div>
				</div>

				<div class="mb-4"><span class="text-danger">*</span> - поля обязательные для заполнения</div>

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
				form: {
					recipientId: '',
					name: '',
					passport: '',
					phone: '',
					region: '',
					city: '',
					street: '',
					house: '',
					flat: '',
				},
				regionOptions: [
					{
						value: 'Андижанская область', text: 'Андижанская область',
					},
					{
						value: 'Бухарска область', text: 'Бухарска область',
					},
					{
						value: 'Джизакская область', text: 'Джизакская область',
					},
					{
						value: 'Кашкадарьинская область', text: 'Кашкадарьинская область',
					},
					{
						value: 'Навоийская область', text: 'Навоийская область',
					},
					{
						value: 'Наманганская область', text: 'Наманганская область',
					},
					{
						value: 'Самаркандская область', text: 'Самаркандская область',
					},
					{
						value: 'Сурхандарьинская область', text: 'Сурхандарьинская область',
					},
					{
						value: 'Сырдарьинская область', text: 'Сырдарьинская область',
					},
					{
						value: 'Ташкентская область', text: 'Ташкентская область',
					},
					{
						value: 'Ферганская область', text: 'Ферганская область',
					},
					{
						value: 'Хорезмская область', text: 'Хорезмская область',
					},
					{
						value: 'Республика Каракалпакстан', text: 'Республика Каракалпакстан',
					},
				]
			}
		},
		props: ['selectedRecipient'],
		mounted() {

		},
		methods: {
			onShow() {
				this.resetForm()

				if (this.selectedRecipient) {
					this.form.recipientId = this.selectedRecipient['Номер']
					this.form.name = this.selectedRecipient['ФИО']
					this.form.passport = this.selectedRecipient['СерияНомерПаспорта']
					this.form.phone = this.selectedRecipient['Телефон']
					this.form.region = this.selectedRecipient['Область']
					this.form.city = this.selectedRecipient['Город']
					this.form.street = this.selectedRecipient['Улица']
					this.form.house = this.selectedRecipient['Дом']
					this.form.flat = this.selectedRecipient['Квартира'] || ''
				}
			},
			onSubmit() {
        if (!this.isInternationalPassport) {
          this.submitForm()
        }
			},
			resetForm() {
				Object.keys(this.form).forEach(key => this.form[key] = '')
			},
			async onSave() {
				this.$refs.submitButton.click()
			},
			async submitForm() {
				const formData = {
					'ФИО': this.form.name,
					'НомерПолучателя': this.form.recipientId,
					'НомерСтраны': '000000001',
					'Область': this.form.region,
					'Город': this.form.city,
					'Улица': this.form.street,
					'Дом': this.form.house,
					'Квартира': this.form.flat,
					'Телефон': this.form.phone,
					'СерияНомерПаспорта': this.form.passport
				}

				this.loading = true

				try {
					await this.$store.dispatch('updateRecipient', formData)
					this.$bvModal.hide('modal-edit-recipient')
					this.$emit('reloadRecipients')
					this.$toast(this.selectedRecipient ? 'Получатель успешно отредактирован!' : 'Получатель успешно создан!')
				} catch (e) {

				} finally {
					this.loading = false
				}

				// try {
				// 	await api.updateOrder(formData)
				// } catch (e) {
				// 	this.$error(messages['something-went-wrong'])
				// } finally {
				// 	this.loading = false
				// }
			}
		},
		computed: {
			userId() {
				return this.$store.getters.userInfo['ID']
			},
      isInternationalPassport() {
        return this.form.passport.indexOf('FA') === 0
      }
    },
		watch: {

		}
	}
</script>
