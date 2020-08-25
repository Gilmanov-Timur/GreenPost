/* eslint-disable */

<template>
	<div>
		<Loader v-if="loading" />
		<h2 class="mb-4">Детали посылки</h2>
		<template v-if="packageId">
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
			Посылка не выбрана!
		</b-alert>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				packageId: this.$route.params.id,
				loading: true,
				details: []
			}
		},
		async mounted() {
			if (!this.packageId) {
				this.loading = false
				return
			}

			try {
				this.details = await this.$store.dispatch('getPackageDetails', this.packageId)
			} catch (e) {

			} finally {
				this.loading = false
			}
		},
		methods: {

		}
	}
</script>