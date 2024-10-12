// 确保引入 webpack
const path = require('path');

module.exports = {
	entry: './src/_worker.ts', // 入口文件
	output: {
		filename: '_worker.js', // 输出文件
		path: path.resolve(__dirname, 'dist'), // 输出目录
		libraryTarget: 'commonjs2', // Cloudflare Workers 需要 CommonJS 格式
	},
	target: 'webworker', // 指定目标环境为 WebWorker
	mode: 'production', // 或 'development'，根据需要调整
	resolve: {
		extensions: ['.ts', '.js'], // 解析这些扩展名
	},
	module: {
		rules: [
			{
				test: /\.ts$/, // 处理 .ts 文件
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	// plugins: [
	// 	// 处理 cloudflare:sockets 的插件
	// 	new webpack.ProvidePlugin({
	// 		// 在这里添加需要提供的模块
	// 		'cloudflare': 'cloudflare:sockets',
	// 	}),
	// ],
};
