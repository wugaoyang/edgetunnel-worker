import CommonUtils from './utils/CommonUtils';

import AppParam from './core/AppParam';
import SubUtils from './utils/SubUtils';
import { vlessOverWSHandler } from './core/SubService';


if (!CommonUtils.isValidUUID(AppParam.userID)) {
	throw new Error('uuid is not valid');
}

export default {
	/**
	 * @param {import('@cloudflare/workers-types').Request} request
	 * @param {{UUID: string, PROXYIP: string}} env
	 * @param {import('@cloudflare/workers-types').ExecutionContext} ctx
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env){
		try {
			const { UA, userAgent, upgradeHeader, url } = await initParam(request, env);
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				switch (url.pathname.toLowerCase()) {
					case '/':
						return await _worker(env, request);

					case `/${AppParam.fakeUserID}`:
						const fakeConfig = await SubUtils.getVLESSConfig(AppParam.userID, request.headers.get('Host'), AppParam.sub, 'CF-Workers-SUB', AppParam.RproxyIP, url);
						return new Response(`${fakeConfig}`, { status: 200 });

					case `/${AppParam.userID}`:
						return await getSubInfo(request, UA, url, env, userAgent);

					default:
						return new Response('Not found', { status: 404 });
				}
			} else {
				AppParam.proxyIP = url.searchParams.get('proxyip') || AppParam.proxyIP;
				if (new RegExp('/proxyip=', 'i').test(url.pathname)) {
					AppParam.proxyIP = url.pathname.toLowerCase().split('/proxyip=')[1];
				} else if (new RegExp('/proxyip.', 'i').test(url.pathname)) {
					AppParam.proxyIP = `proxyip.${url.pathname.toLowerCase().split('/proxyip.')[1]}`;
				}
				AppParam.socks5Address = url.searchParams.get('socks5') || AppParam.socks5Address;
				if (new RegExp('/socks5=', 'i').test(url.pathname)) {
					AppParam.socks5Address = url.pathname.split('5=')[1];
				} else if (new RegExp('/socks://', 'i').test(url.pathname) || new RegExp('/socks5://', 'i').test(url.pathname)) {
					AppParam.socks5Address = url.pathname.split('://')[1].split('#')[0];
					if (AppParam.socks5Address.includes('@')) {
						let userPassword = AppParam.socks5Address.split('@')[0];
						const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
						if (base64Regex.test(userPassword) && !userPassword.includes(':')) userPassword = atob(userPassword);
						AppParam.socks5Address = `${userPassword}@${AppParam.socks5Address.split('@')[1]}`;
					}
				}
				if (AppParam.socks5Address) {
					try {
						AppParam.parsedSocks5Address = CommonUtils.socks5AddressParser(AppParam.socks5Address);
						AppParam.enableSocks = true;
					} catch (err) {
						/** @type {Error} */
						let e = err;
						// @ts-ignore
						console.log(e.toString());
						AppParam.enableSocks = false;
					}
				} else {
					AppParam.enableSocks = false;
				}
				return await vlessOverWSHandler(request);
			}
		} catch (err) {
			/** @type {Error} */
			let e = err;
			// @ts-ignore
			return new Response(e.toString());
		}
	}
};


/**
 * 初始化参数
 * @param request
 * @param env
 */
async function initParam(request, env) {
	const UA = request.headers.get('User-Agent') || 'null';
	const userAgent = UA.toLowerCase();
	AppParam.userID = (env.UUID || AppParam.userID).toLowerCase();

	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0);
	const timestamp = Math.ceil(currentDate.getTime() / 1000);
	const fakeUserIDMD5 = await CommonUtils.MD5MD5(`${AppParam.userID}${timestamp}`);
	AppParam.fakeUserID = fakeUserIDMD5.slice(0, 8) + '-' + fakeUserIDMD5.slice(8, 12) + '-' + fakeUserIDMD5.slice(12, 16) + '-' + fakeUserIDMD5.slice(16, 20) + '-' + fakeUserIDMD5.slice(20);
	AppParam.fakeHostName = fakeUserIDMD5.slice(6, 9) + '.' + fakeUserIDMD5.slice(13, 19);
	//console.log(`虚假UUID: ${fakeUserID}`); // 打印fakeID

	AppParam.proxyIP = env.PROXYIP || AppParam.proxyIP;
	AppParam.proxyIPs = await CommonUtils.ADD(AppParam.proxyIP);
	AppParam.proxyIP = AppParam.proxyIPs[Math.floor(Math.random() * AppParam.proxyIPs.length)];
	//console.log(proxyIP);
	AppParam.socks5Address = env.SOCKS5 || AppParam.socks5Address;
	AppParam.socks5s = await CommonUtils.ADD(AppParam.socks5Address);
	AppParam.socks5Address = AppParam.socks5s[Math.floor(Math.random() * AppParam.socks5s.length)];
	AppParam.socks5Address = AppParam.socks5Address.split('//')[1] || AppParam.socks5Address;

	AppParam.sub = env.SUB || AppParam.sub;
	AppParam.subconverter = env.SUBAPI || AppParam.subconverter;
	if (AppParam.subconverter.includes('http://')) {
		AppParam.subconverter = AppParam.subconverter.split('//')[1];
		AppParam.subProtocol = 'http';
	} else {
		AppParam.subconverter = AppParam.subconverter.split('//')[1] || AppParam.subconverter;
	}
	AppParam.subconfig = env.SUBCONFIG || AppParam.subconfig;
	if (AppParam.socks5Address) {
		try {
			AppParam.parsedSocks5Address = CommonUtils.socks5AddressParser(AppParam.socks5Address);
			AppParam.RproxyIP = env.RPROXYIP || 'false';
			AppParam.enableSocks = true;
		} catch (err) {
			/** @type {Error} */
			let e = err;
			// @ts-ignore
			console.log(e.toString());
			AppParam.RproxyIP = env.RPROXYIP || !AppParam.proxyIP ? 'true' : 'false';
			AppParam.enableSocks = false;
		}
	} else {
		AppParam.RproxyIP = env.RPROXYIP || !AppParam.proxyIP ? 'true' : 'false';
	}
	if (env.ADD) AppParam.addresses = await CommonUtils.ADD(env.ADD);
	if (env.ADDAPI) AppParam.addressesapi = await CommonUtils.ADD(env.ADDAPI);
	if (env.ADDNOTLS) AppParam.addressesnotls = await CommonUtils.ADD(env.ADDNOTLS);
	if (env.ADDNOTLSAPI) AppParam.addressesnotlsapi = await CommonUtils.ADD(env.ADDNOTLSAPI);
	if (env.ADDCSV) AppParam.addressescsv = await CommonUtils.ADD(env.ADDCSV);
	AppParam.DLS = env.DLS || AppParam.DLS;
	AppParam.BotToken = env.TGTOKEN || AppParam.BotToken;
	AppParam.ChatID = env.TGID || AppParam.ChatID;
	if (env.GO2SOCKS5) AppParam.go2Socks5s = await CommonUtils.ADD(env.GO2SOCKS5);
	const upgradeHeader = request.headers.get('Upgrade');
	const url = new URL(request.url);
	if (url.searchParams.has('sub') && url.searchParams.get('sub') !== '') AppParam.sub = url.searchParams.get('sub');
	AppParam.FileName = env.SUBNAME || AppParam.FileName;
	if (url.searchParams.has('notls')) AppParam.noTLS = 'true';
	return { UA, userAgent, upgradeHeader, url };
}

/**
 * 首页
 * @param env
 * @param request
 */
async function _worker(env, request) {
	const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
	if (envKey) {
		const URLs = await CommonUtils.ADD(env[envKey]);
		const URL = URLs[Math.floor(Math.random() * URLs.length)];
		return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
	}
	return new Response(JSON.stringify(request.cf, null, 4), { status: 200 });
}


/**
 * 获取订阅内容
 * @param request
 * @param UA
 * @param url
 * @param env
 * @param userAgent
 */
async function getSubInfo(request, UA, url, env, userAgent) {
	await sendMessage(`#获取订阅 ${AppParam.FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${UA}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
	const vlessConfig = await SubUtils.getVLESSConfig(AppParam.userID, request.headers.get('Host'), AppParam.sub, UA, AppParam.RproxyIP, url);
	const now = Date.now();
	//const timestamp = Math.floor(now / 1000);
	const today = new Date(now);
	today.setHours(0, 0, 0, 0);
	const UD = Math.floor(((now - today.getTime()) / 86400000) * 24 * 1099511627776 / 2);
	let pagesSum = UD;
	let workersSum = UD;
	let total = 24 * 1099511627776;
	if (env.CFEMAIL && env.CFKEY) {
		const email = env.CFEMAIL;
		const key = env.CFKEY;
		const accountIndex = env.CFID || 0;
		const accountId = await SubUtils.getAccountId(email, key);
		if (accountId) {
			const now = new Date();
			now.setUTCHours(0, 0, 0, 0);
			const startDate = now.toISOString();
			const endDate = new Date().toISOString();
			const Sum = await SubUtils.getSum(accountId, accountIndex, email, key, startDate, endDate);
			pagesSum = Sum[0];
			workersSum = Sum[1];
			total = 102400;
		}
	}
	console.log(`pagesSum: ${pagesSum}\nworkersSum: ${workersSum}\ntotal: ${total}`);
	if (userAgent && userAgent.includes('mozilla')) {
		return new Response(`${vlessConfig}`, {
			status: 200,
			headers: {
				'Content-Type': 'text/plain;charset=utf-8',
				'Profile-Update-Interval': '6',
				'Subscription-Userinfo': `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=${AppParam.expire}`
			}
		});
	} else {
		return new Response(`${vlessConfig}`, {
			status: 200,
			headers: {
				'Content-Disposition': `attachment; filename=${AppParam.FileName}; filename*=utf-8''${encodeURIComponent(AppParam.FileName)}`,
				'Content-Type': 'text/plain;charset=utf-8',
				'Profile-Update-Interval': '6',
				'Subscription-Userinfo': `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=${AppParam.expire}`
			}
		});
	}
}
