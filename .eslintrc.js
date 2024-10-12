
module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['import'],
	rules: {
		'import/no-dynamic-require': 'error', // 禁止动态 require
		'global-require': 'error', // 禁止使用全局 require
		'import/no-webpack-loader-syntax': 'error', // 禁止使用 Webpack 的动态导入语法
	},
};
