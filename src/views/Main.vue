<template>
	<div>
		<Loader v-if="loading" />

    <b-alert
      variant="warning"
      class="px-2 px-sm-3"
      show
    >
      Товары поступившие на склад в Китае хранятся 14 дней, далее будут утилизированы!
    </b-alert>

		<div class="row">
			<div class="col-12">
				<b-card class="order-search-form mb-3">
					<template v-slot:header>
            <div class="h4 mb-0 mx-n2 mx-sm-0">
							{{ $t('track-order') }}
						</div>
					</template>
          <b-card-text class="mx-n2 mx-sm-0" style="font-size: 14px;">
						<b-form @submit.prevent="onSubmit">
							<div class="form-group mb-0">
								<b-input-group>
									<b-input v-model.trim="track" :disabled="loading" :placeholder="$t('input-track-number')" required />
									<b-input-group-append>
										<b-button type="submit" variant="info" class="ml-1" :disabled="!track || loading">
											{{ $t('track') }}
										</b-button>
									</b-input-group-append>
								</b-input-group>
							</div>
						</b-form>
					</b-card-text>
				</b-card>

        <div v-if="searched">
          <div class="table-responsive" v-if="orders.length">
            <table class="table table-bordered">
              <tr class="table-info">
                <th class="align-middle">{{ $t('date') }}</th>
                <th class="align-middle">{{ $t('product-name') }}</th>
                <th class="align-middle">{{ $t('tracking-number') }}</th>
                <th class="align-middle">{{ $t('warehouse-receive') }}</th>
                <th class="align-middle">{{ $t('status') }}</th>
                <th class="align-middle">{{ $t('package') }}</th>
              </tr>
              <tr v-for="order of orders" :key="order['Номер']">
                <td class="align-middle">
                  {{ order['Дата'] }}
                </td>
                <td class="align-middle">
                  {{ order['ВидТовара'] }}
                </td>
                <td class="align-middle">
                  {{ order['ТрекПоступления'] }}
                </td>
                <td class="align-middle">
                  {{ order['ПоступилНаСклад'] }}
                </td>
                <td class="align-middle">
                  {{ order['Статус'] }}
                </td>
                <td class="align-middle">
                  {{ order['Посылка'] }}
                </td>
              </tr>
            </table>
          </div>
          <b-alert show variant="warning" class="d-inline-block" v-else>
            {{ $t('order-not-found') }}
          </b-alert>
        </div>
			</div>
			<div class="col-12">
				<b-card class="mb-3">
					<template v-slot:header>
						<div class="h4 mb-0 mx-n2 mx-sm-0">
              {{ $t('your-china-address') }}
            </div>
					</template>
					<b-card-text class="mx-n2 mx-sm-0" style="font-size: 14px;">
						<div class="mb-1">
							<b>地址:</b> 广州市天河区龙洞商贸城自编V108号 ID:{{ userInfo['ID'] }}
						</div>
						<div class="mb-1">
							<b>收货人:</b> ID:{{ userInfo['ID'] }}
						</div>
						<div class="mb-1">
							<b>邮政编码:</b> 510520
						</div>
						<div>
							<b>手机号:</b> 15989014545
						</div>
					</b-card-text>
				</b-card>
			</div>
		</div>

    <b-alert show class="px-2 px-sm-3">
      <pre style="white-space: pre-line; font-size: 100%;" class="m-0">
❗️ После добавления адреса на маркетплейс просим связаться с нами для проверки!
✈️ Авиа 3-7 дней - 9,5$/кг (Отправка: Вторник, Пятница)
🚛 Авто 20-30 дней - 5,5$/кг (Отправка: Суббота)
📦 Минималка 100 грамм
⚠️ Товары содержащие батарейки, жидкости, порошки, магниты, косметику и продукты питания можно отправлять только Авто.
📍 Наши филиалы: Мирабад, Чиланзар, Алмазар, Юнусабад, Мирзо-Улугбек, Яшнабад
🚚 Доставка по Узбекистану - 2 долл/шт посылку (0,1кг - 30 кг)
💰 Габаритные и коммерческие товары тарифицируются отдельно!
🔗 Более подробная информация на сайте <a href="https://greenpost.uz" target="_blank">Greenpost.uz</a></pre>
    </b-alert>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				searched: false,
				track: null,
				orders: [],
			}
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			onSubmit() {
				this.getOrders()
			},
			async getOrders() {
				const dateRange = {
					startDate: '',
					endDate: '',
				}

				this.loading = true

				try {
					const orders = (await this.$store.dispatch('getAllOrders', dateRange))
						.filter(order => order['ТрекПоступления'] === this.track)
					orders
						.sort((a, b) => Number(b['Номер'].replace(/\D/g, '')) - Number(a['Номер'].replace(/\D/g, '')))
					this.orders = orders
					this.searched = true
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			},
		},
	}
</script>
