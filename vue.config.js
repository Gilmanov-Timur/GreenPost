module.exports = {
	runtimeCompiler: true,
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production' ? '/gp_cabinet/' : '/',
	pwa: {
		name: 'GreenPost',
		themeColor: '#21bf86',
		appleMobileWebAppCapable: 'yes',
		manifestOptions: {
			background_color: '#ffffff',
			description: 'Выгодная доставка из Китая',
		},
		iconPaths: {
			favicon16: null,
		}
	},
	devServer: {
		proxy: {
			'^/api': {
				target: 'https://app.greenpost.uz',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				},
			}
		}
	}
}
