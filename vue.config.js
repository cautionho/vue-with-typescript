const path = require('path')
const merge = require('webpack-merge');
module.exports = {
	publicPath: './',
	outputDir: './erp',
	assetsDir: './',
	indexPath: 'index.html',
	pages: {
		index: {
			entry: 'src/main.ts',
			template: 'public/index.html',
			filename: 'index.html',
			title: 'index',
			chunks: ['chunk-vendors', 'chunk-common', 'index']
		}
	},
	lintOnSave: false,
	// use the full build with in-browser compiler?
	// https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
	//   compiler: false,
	// webpack配置
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	chainWebpack: (config) => {},
	configureWebpack: {
		resolve: {
			alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, "src")
			}
		}
	},
	// vue-loader 配置项
	// https://vue-loader.vuejs.org/en/options.html
	// vueLoader: {},
	productionSourceMap: false,
	css: {
		extract: true,
		sourceMap: false,
		loaderOptions: {
			less: {
				javascriptEnabled: true
			}
		},
		modules: false
	},
	parallel: require('os').cpus().length > 1,
	// 是否启用dll
	// See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
	// dll: false,
	// PWA 插件相关配置
	// see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {},
	devServer: {
		// open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 9999,
		https: false,
		hotOnly: false,
		proxy: null,
		before: app => {}
	}
	// ,
	// pluginOptions: {
	//   'autoprefixer': {
	//     browsers: ['Android >= 4.0', 'iOS >= 7']
	//   },
	//   'postcss-pxtorem': {
	//     rootValue: 0,
	//     propList: ['*']
	//   }
	// }
}
