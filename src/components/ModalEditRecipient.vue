<template>
	<b-modal
		id="modal-edit-recipient"
		centered
		scrollable
		no-close-on-backdrop
		header-close-label="Закрыть"
		:title="selectedRecipient ? 'Редактирование получателя' : 'Добавить нового получателя'"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
		@hide="$emit('hide')"
	>
		<template v-slot:default>
			<Loader v-if="loading" />
			<b-form @submit.prevent="onSubmit">
				<div class="form-row form-group">
					<label for="form-name" class="col-5 col-form-label">
						ФИО <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-name" v-model.trim="form.name" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-passport" class="col-5 col-form-label">
						Серия/номер паспорта <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="text"
							id="form-passport"
							class="form-control"
							v-model.trim="form.passport"
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
					<div class="col-5 col-form-label">
						<label for="form-pinfl" class="mb-0 mr-1">
							ПИНФЛ
						</label>
						<BIconQuestionCircle
							class="cursor-pointer mr-1"
							@click="$bvModal.show('modal-pinfl')"
						/>
						<span class="text-danger">*</span>
					</div>
					<div class="col">
						<input
							type="tel"
							id="form-pinfl"
							class="form-control"
							:class="{'border-danger': submitted && !isPinflValid}"
							v-model.trim="form.pinfl"
							v-mask="{mask: '99999999999999', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
					<div class="col-12" v-if="submitted && !isPinflValid">
						<div class="alert alert-danger mt-2 mb-0">
							Введите корректный ПИНФЛ
						</div>
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-phone" class="col-5 col-form-label">
						Номер телефона <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="tel"
							id="form-phone"
							class="form-control"
							v-model.trim="form.phone"
							v-mask="{mask: '+[999999999999]', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-region" class="col-5 col-form-label">
						Регион <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-form-select
							id="form-region"
							v-model="form.region"
							:options="regionOptions"
							required
						/>
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-city" class="col-5 col-form-label">
						Город <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-city" v-model.trim="form.city" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-street" class="col-5 col-form-label">
						Улица <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-street" v-model.trim="form.street" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-house" class="col-5 col-form-label">
						Дом <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-house" v-model.trim="form.house" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-flat" class="col-5 col-form-label">
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
				submitted: false,
				form: {
					recipientId: '',
					name: '',
					passport: '',
					pinfl: '',
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
		methods: {
			onShow() {
				this.resetForm()

				if (this.selectedRecipient) {
					this.form.recipientId = this.selectedRecipient['Номер']
					this.form.name = this.selectedRecipient['ФИО']
					this.form.passport = this.selectedRecipient['СерияНомерПаспорта']
					this.form.pinfl = this.selectedRecipient['ПИНФЛ']
					this.form.phone = this.selectedRecipient['Телефон']
					this.form.region = this.selectedRecipient['Область']
					this.form.city = this.selectedRecipient['Город']
					this.form.street = this.selectedRecipient['Улица']
					this.form.house = this.selectedRecipient['Дом']
					this.form.flat = this.selectedRecipient['Квартира'] || ''
				}
			},
			onSubmit() {
				this.submitted = true
				if (!this.isInternationalPassport && this.isPinflValid) {
					this.submitForm()
				}
			},
			resetForm() {
				this.submitted = false
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
					'СерияНомерПаспорта': this.form.passport,
					'ПИНФЛ': this.form.pinfl,
				}

				this.loading = true

				try {
					await this.$store.dispatch('updateRecipient', formData)
					this.$bvModal.hide('modal-edit-recipient')
					this.$emit('reloadRecipients')
					this.$toast(this.selectedRecipient ? 'Получатель успешно отредактирован!' : 'Получатель успешно создан!')
				} catch (e) {} finally {
					this.loading = false
				}
			}
		},
		computed: {
			userId() {
				return this.$store.getters.userInfo['ID']
			},
			isInternationalPassport() {
				return this.form.passport.indexOf('FA') === 0
			},
			isPinflValid() {
				return this.form.pinfl.length === 14 && /^[1-6](0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{9}$/.test(this.form.pinfl)
			}
		},
	}
</script>
