<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col">
				<h2 class="mb-4">Расчеты</h2>
			</div>
		</div>

		<div class="table-responsive">
			<table class="table table-bordered">
				<tr class="table-info">
					<th>Описание</th>
					<th>Тип транзакции</th>
					<th>Сумма</th>
					<th>Детали транзакции</th>
				</tr>
				<tr v-for="(payment, index) of payments" :key="index">
					<td>{{ payment['Описание'] }}</td>
					<td>{{ payment['ТипТранзакции'] }}</td>
					<td>{{ payment['Сумма'] }}</td>
					<td>{{ payment['Детали'] }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				payments: [],
			}
		},
		async mounted() {
			this.getPayments()
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			async getPayments() {
				this.loading = true

				try {
					this.payments = await this.$store.dispatch('getPayments')
				} catch (e) {

				} finally {
					this.loading = false
				}
			},

		},
		components: {

		},
	}
</script>