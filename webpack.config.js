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
	devtool: 'source-map', // 生成 source map
	externals: {
		'cloudflare:sockets': 'commonjs cloudflare:sockets',  // 告诉 Webpack 忽略这个模块
	},
};
