module.exports = {
	runtimeCompiler: true,
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production' ? '/gp_cabinet/' : '/',
}
