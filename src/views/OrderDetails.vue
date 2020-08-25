/* eslint-disable */

<template>
	<div>
		<Loader v-if="loading" />
		<h2 class="mb-4">Детали заказа</h2>
		<template v-if="orderId">
			<div class="table-responsive">
				<table class="table table-bordered">
					<tr v-for="(value, name) in details" :key="name">
						<td>
							{{ name }}
						</td>
						<td>
							{{ value }}
						</td>
					</tr>
				</table>
			</div>
		</template>
		<b-alert variant="danger" show class="mt-4" v-else>
			Заказ не выбран!
		</b-alert>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				orderId: this.$route.params.id,
				loading: true,
				details: []
			}
		},
		async mounted() {
			if (!this.orderId) {
				this.loading = false
				return
			}

			try {
				this.details = await this.$store.dispatch('getOrderDetails', this.orderId)
			} catch (e) {

			} finally {
				this.loading = false
			}
		},
		methods: {

		}
	}
</script>