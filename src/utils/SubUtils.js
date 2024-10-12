//订阅工具

import AppParam from '../core/AppParam';
import CommonUtils from './CommonUtils';

const 啥啥啥_写的这是啥啊 = 'dmxlc3M=';
const subParams = ['sub','base64','b64','clash','singbox','sb'];

export default class SubUtils{


	/**
	 * 解析并清理环境变量中的地址列表
	 * 这个函数用于处理包含多个地址的环境变量
	 * 它会移除所有的空白字符、引号等，并将地址列表转换为数组
	 *
	 * @param {string} envadd 包含地址列表的环境变量值
	 * @returns {Promise<string[]>} 清理和分割后的地址数组
	 */
	static async ADD(envadd) {
		// 将制表符、双引号、单引号和换行符都替换为逗号
		// 然后将连续的多个逗号替换为单个逗号
		var addtext = envadd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');

		// 删除开头和结尾的逗号（如果有的话）
		if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
		if (addtext.charAt(addtext.length - 1) == ',') addtext = addtext.slice(0, addtext.length - 1);

		// 使用逗号分割字符串，得到地址数组
		const add = addtext.split(',');

		return add;
	}

	static checkSUB(host) {
		if ((!AppParam.sub || AppParam.sub == '') && (AppParam.addresses.length + AppParam.addressesapi.length + AppParam.addressesnotls.length + AppParam.addressesnotlsapi.length + AppParam.addressescsv.length) == 0){
			AppParam.addresses = [
				'Join.my.Telegram.channel.CMLiussss.to.unlock.more.premium.nodes.cf.090227.xyz#加入我的频道t.me/CMLiussss解锁更多优选节点',
				'visa.cn:443',
				'www.visa.com:8443',
				'cis.visa.com:2053',
				'africa.visa.com:2083',
				'www.visa.com.sg:2087',
				'www.visaeurope.at:2096',
				'www.visa.com.mt:8443',
				'qa.visamiddleeast.com',
				'time.is',
				'www.wto.org:8443',
				'chatgpt.com:2087',
				'icook.hk',
				//'104.17.0.0#IPv4',
				'[2606:4700::]#IPv6'
			];
			if (host.includes(".workers.dev")) {
				AppParam.addressesnotls = [
					'usa.visa.com:2095',
					'myanmar.visa.com:8080',
					'www.visa.com.tw:8880',
					'www.visaeurope.ch:2052',
					'www.visa.com.br:2082',
					'www.visasoutheasteurope.com:2086'
				];
			}
		}
	}

	static 配置信息(UUID, 域名地址) {
		const 协议类型 = atob(啥啥啥_写的这是啥啊);

		const 别名 = AppParam.FileName;
		let 地址 = 域名地址;
		let 端口 = 443;

		const 用户ID = UUID;
		const 加密方式 = 'none';

		const 传输层协议 = 'ws';
		const 伪装域名 = 域名地址;
		const 路径 = '/?ed=2560';

		let 传输层安全 = ['tls',true];
		const SNI = 域名地址;
		const 指纹 = 'randomized';

		if (域名地址.includes('.workers.dev')){
			地址 = 'visa.cn';
			端口 = 80 ;
			传输层安全 = ['',false];
		}

		const v2ray = `${协议类型}://${用户ID}@${地址}:${端口}?encryption=${加密方式}&security=${传输层安全[0]}&sni=${SNI}&fp=${指纹}&type=${传输层协议}&host=${伪装域名}&path=${encodeURIComponent(路径)}#${encodeURIComponent(别名)}`;
		const clash = `- type: ${协议类型}
  name: ${AppParam.FileName}
  server: ${地址}
  port: ${端口}
  uuid: ${用户ID}
  network: ${传输层协议}
  tls: ${传输层安全[1]}
  udp: false
  sni: ${SNI}
  client-fingerprint: ${指纹}
  ws-opts:
    path: "${路径}"
    headers:
      host: ${伪装域名}`;
		return [v2ray,clash];
	}

	/**
	 * @param {string} userID
	 * @param {string | null} hostName
	 * @param {string} sub
	 * @param {string} UA
	 * @returns {Promise<string>}
	 */
	static async getVLESSConfig(userID, hostName, sub, UA, RproxyIP, _url) {
		this.checkSUB(hostName);
		const userAgent = UA.toLowerCase();
		const Config = this.配置信息(userID , hostName);
		const v2ray = Config[0];
		const clash = Config[1];
		let proxyhost = "";
		if(hostName.includes(".workers.dev") || hostName.includes(".pages.dev")){
			if ( AppParam.proxyhostsURL && (!AppParam.proxyhosts || AppParam.proxyhosts.length == 0)) {
				try {
					const response = await fetch(AppParam.proxyhostsURL);

					if (!response.ok) {
						console.error('获取地址时出错:', response.status, response.statusText);
						return; // 如果有错误，直接返回
					}

					const text = await response.text();
					const lines = text.split('\n');
					// 过滤掉空行或只包含空白字符的行
					const nonEmptyLines = lines.filter(line => line.trim() !== '');

					AppParam.proxyhosts = AppParam.proxyhosts.concat(nonEmptyLines);
				} catch (error) {
					//console.error('获取地址时出错:', error);
				}
			}
			if (AppParam.proxyhosts.length != 0) proxyhost = AppParam.proxyhosts[Math.floor(Math.random() * AppParam.proxyhosts.length)] + "/";
		}

		if ( userAgent.includes('mozilla') && !subParams.some(_searchParams => _url.searchParams.has(_searchParams))) {
			const newSocks5s = AppParam.socks5s.map(socks5Address => {
				if (socks5Address.includes('@')) return socks5Address.split('@')[1];
				else if (socks5Address.includes('//')) return socks5Address.split('//')[1];
				else return socks5Address;
			});

			let socks5List = '';
			if( AppParam.go2Socks5s.length > 0 && AppParam.enableSocks ) {
				socks5List = `${decodeURIComponent('SOCKS5%EF%BC%88%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%89%3A%20')}`;
				if (AppParam.go2Socks5s.includes(atob('YWxsIGlu'))||AppParam.go2Socks5s.includes(atob('Kg=='))) socks5List += `${decodeURIComponent('%E6%89%80%E6%9C%89%E6%B5%81%E9%87%8F')}\n`;
				else socks5List += `\n  ${AppParam.go2Socks5s.join('\n  ')}\n`;
			}

			let 订阅器 = '';
			if (!sub || sub == '') {
				if (AppParam.enableSocks) 订阅器 += `CFCDN（访问方式）: Socks5\n  ${newSocks5s.join('\n  ')}\n${socks5List}`;
				else if (AppParam.proxyIP && AppParam.proxyIP != '') 订阅器 += `CFCDN（访问方式）: ProxyIP\n  ${AppParam.proxyIPs.join('\n  ')}\n`;
				else 订阅器 += `CFCDN（访问方式）: 无法访问, 需要您设置 proxyIP/PROXYIP ！！！\n`;
				订阅器 += `\n您的订阅内容由 内置 addresses/ADD* 参数变量提供\n`;
				if (AppParam.addresses.length > 0) 订阅器 += `ADD（TLS优选域名&IP）: \n  ${AppParam.addresses.join('\n  ')}\n`;
				if (AppParam.addressesnotls.length > 0) 订阅器 += `ADDNOTLS（noTLS优选域名&IP）: \n  ${AppParam.addressesnotls.join('\n  ')}\n`;
				if (AppParam.addressesapi.length > 0) 订阅器 += `ADDAPI（TLS优选域名&IP 的 API）: \n  ${AppParam.addressesapi.join('\n  ')}\n`;
				if (AppParam.addressesnotlsapi.length > 0) 订阅器 += `ADDNOTLSAPI（noTLS优选域名&IP 的 API）: \n  ${AppParam.addressesnotlsapi.join('\n  ')}\n`;
				if (AppParam.addressescsv.length > 0) 订阅器 += `ADDCSV（IPTest测速csv文件 限速 ${AppParam.DLS} ）: \n  ${AppParam.addressescsv.join('\n  ')}\n`;
			} else {
				if (AppParam.enableSocks) 订阅器 += `CFCDN（访问方式）: Socks5\n  ${newSocks5s.join('\n  ')}\n${socks5List}`;
				else if (AppParam.proxyIP && AppParam.proxyIP != '') 订阅器 += `CFCDN（访问方式）: ProxyIP\n  ${AppParam.proxyIPs.join('\n  ')}\n`;
				else if (RproxyIP == 'true') 订阅器 += `CFCDN（访问方式）: 自动获取ProxyIP\n`;
				else 订阅器 += `CFCDN（访问方式）: 无法访问, 需要您设置 proxyIP/PROXYIP ！！！\n`
				订阅器 += `\nSUB（优选订阅生成器）: ${sub}`;
			}

			return `
################################################################
Subscribe / sub 订阅地址, 支持 Base64、clash-meta、sing-box 订阅格式
---------------------------------------------------------------
快速自适应订阅地址:
https://${proxyhost}${hostName}/${userID}
https://${proxyhost}${hostName}/${userID}?sub

Base64订阅地址:
https://${proxyhost}${hostName}/${userID}?b64
https://${proxyhost}${hostName}/${userID}?base64

clash订阅地址:
https://${proxyhost}${hostName}/${userID}?clash

singbox订阅地址:
https://${proxyhost}${hostName}/${userID}?sb
https://${proxyhost}${hostName}/${userID}?singbox
---------------------------------------------------------------
################################################################
${AppParam.FileName} 配置信息
---------------------------------------------------------------
HOST: ${hostName}
UUID: ${userID}
FKID: ${AppParam.fakeUserID}
UA: ${UA}

${订阅器}
SUBAPI（订阅转换后端）: ${AppParam.subProtocol}://${AppParam.subconverter}
SUBCONFIG（订阅转换配置文件）: ${AppParam.subconfig}
---------------------------------------------------------------
################################################################
v2ray
---------------------------------------------------------------
${v2ray}
---------------------------------------------------------------
################################################################
clash-meta
---------------------------------------------------------------
${clash}
---------------------------------------------------------------
################################################################
telegram 交流群 技术大佬~在线发牌!
https://t.me/CMLiussss
---------------------------------------------------------------
github 项目地址 Star!Star!Star!!!
https://github.com/cmliu/edgetunnel
---------------------------------------------------------------
################################################################
`;
		} else {
			if (typeof fetch != 'function') {
				return 'Error: fetch is not available in this environment.';
			}

			let newAddressesapi  = [];
			let newAddressescsv = [];
			let newAddressesnotlsapi = [];
			let newAddressesnotlscsv = [];

			// 如果是使用默认域名，则改成一个workers的域名，订阅器会加上代理
			if (hostName.includes(".workers.dev")){
				AppParam.noTLS = 'true';
				AppParam.fakeHostName = `${AppParam.fakeHostName}.workers.dev`;
				newAddressesnotlsapi = await this.getAddressesapi(AppParam.addressesnotlsapi);
				newAddressesnotlscsv = await this.getAddressescsv('FALSE');
			} else if (hostName.includes(".pages.dev")){
				AppParam.fakeHostName = `${AppParam.fakeHostName}.pages.dev`;
			} else if (hostName.includes("worker") || hostName.includes("notls") || AppParam.noTLS == 'true'){
				AppParam.noTLS = 'true';
				AppParam.fakeHostName = `notls${AppParam.fakeHostName}.net`;
				newAddressesnotlsapi = await this.getAddressesapi(AppParam.addressesnotlsapi);
				newAddressesnotlscsv = await this.getAddressescsv('FALSE');
			} else {
				AppParam.fakeHostName = `${AppParam.fakeHostName}.xyz`
			}
			console.log(`虚假HOST: ${AppParam.fakeHostName}`);
			let url = `${AppParam.subProtocol}://${sub}/sub?host=${AppParam.fakeHostName}&uuid=${AppParam.fakeUserID}&edgetunnel=cmliu&proxyip=${RproxyIP}`;
			let isBase64 = true;

			if (!sub || sub == ""){
				if(hostName.includes('workers.dev') || hostName.includes('pages.dev')) {
					if (AppParam.proxyhostsURL && (!AppParam.proxyhosts || AppParam.proxyhosts.length == 0)) {
						try {
							const response = await fetch(AppParam.proxyhostsURL);

							if (!response.ok) {
								console.error('获取地址时出错:', response.status, response.statusText);
								return; // 如果有错误，直接返回
							}

							const text = await response.text();
							const lines = text.split('\n');
							// 过滤掉空行或只包含空白字符的行
							const nonEmptyLines = lines.filter(line => line.trim() !== '');

							AppParam.proxyhosts = AppParam.proxyhosts.concat(nonEmptyLines);
						} catch (error) {
							console.error('获取地址时出错:', error);
						}
					}
					// 使用Set对象去重
					AppParam.proxyhosts = [...new Set(AppParam.proxyhosts)];
				}

				newAddressesapi = await this.getAddressesapi(AppParam.addressesapi);
				newAddressescsv = await this.getAddressescsv('TRUE');
				url = `https://${hostName}/${AppParam.fakeUserID}`;
				if (hostName.includes("worker") || hostName.includes("notls") || AppParam.noTLS == 'true') url += '?notls';
				console.log(`虚假订阅: ${url}`);
			}

			if (!userAgent.includes(('CF-Workers-SUB').toLowerCase())){
				if ((userAgent.includes('clash') && !userAgent.includes('nekobox')) || ( _url.searchParams.has('clash') && !userAgent.includes('subconverter'))) {
					url = `${AppParam.subProtocol}://${AppParam.subconverter}/sub?target=clash&url=${encodeURIComponent(url)}&insert=false&config=${encodeURIComponent(AppParam.subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
					isBase64 = false;
				} else if (userAgent.includes('sing-box') || userAgent.includes('singbox') || (( _url.searchParams.has('singbox') || _url.searchParams.has('sb')) && !userAgent.includes('subconverter'))) {
					url = `${AppParam.subProtocol}://${AppParam.subconverter}/sub?target=singbox&url=${encodeURIComponent(url)}&insert=false&config=${encodeURIComponent(AppParam.subconfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
					isBase64 = false;
				}
			}

			try {
				let content;
				if ((!sub || sub == "") && isBase64 == true) {
					content = await this.subAddresses(AppParam.fakeHostName,AppParam.fakeUserID,AppParam.noTLS,newAddressesapi,newAddressescsv,newAddressesnotlsapi,newAddressesnotlscsv);
				} else {
					const response = await fetch(url ,{
						headers: {
							'User-Agent': `${UA} CF-Workers-edgetunnel/cmliu`
						}});
					content = await response.text();
				}

				if (_url.pathname == `/${AppParam.fakeUserID}`) return content;

				return CommonUtils.revertFakeInfo(content, userID, hostName, isBase64);

			} catch (error) {
				console.error('Error fetching content:', error);
				// @ts-ignore
				return `Error fetching content: ${error.message}`;
			}

		}
	}

  static 	async getAccountId(email, key) {
		try {
			const url = 'https://api.cloudflare.com/client/v4/accounts';
			const headers = new Headers({
				'X-AUTH-EMAIL': email,
				'X-AUTH-KEY': key
			});
			const response = await fetch(url, { headers });
			const data = await response.json();
			// @ts-ignore
			return data.result[0].id; // 假设我们需要第一个账号ID
		} catch (error) {
			return false ;
		}
	}

	static async getSum(accountId, accountIndex, email, key, startDate, endDate) {
		try {
			const startDateISO = new Date(startDate).toISOString();
			const endDateISO = new Date(endDate).toISOString();

			const query = JSON.stringify({
				query: `query getBillingMetrics($accountId: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) {
				viewer {
					accounts(filter: {accountTag: $accountId}) {
						pagesFunctionsInvocationsAdaptiveGroups(limit: 1000, filter: $filter) {
							sum {
								requests
							}
						}
						workersInvocationsAdaptive(limit: 10000, filter: $filter) {
							sum {
								requests
							}
						}
					}
				}
			}`,
				variables: {
					accountId,
					filter: { datetime_geq: startDateISO, datetime_leq: endDateISO }
				},
			});

			const headers = new Headers({
				'Content-Type': 'application/json',
				'X-AUTH-EMAIL': email,
				'X-AUTH-KEY': key,
			});

			const response = await fetch(`https://api.cloudflare.com/client/v4/graphql`, {
				method: 'POST',
				headers: headers,
				body: query
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const res = await response.json();

			// @ts-ignore
			const pagesFunctionsInvocationsAdaptiveGroups = res?.data?.viewer?.accounts?.[accountIndex]?.pagesFunctionsInvocationsAdaptiveGroups;
			// @ts-ignore
			const workersInvocationsAdaptive = res?.data?.viewer?.accounts?.[accountIndex]?.workersInvocationsAdaptive;

			if (!pagesFunctionsInvocationsAdaptiveGroups && !workersInvocationsAdaptive) {
				throw new Error('找不到数据');
			}

			const pagesSum = pagesFunctionsInvocationsAdaptiveGroups.reduce((a, b) => a + b?.sum.requests, 0);
			const workersSum = workersInvocationsAdaptive.reduce((a, b) => a + b?.sum.requests, 0);

			//console.log(`范围: ${startDateISO} ~ ${endDateISO}\n默认取第 ${accountIndex} 项`);

			return [pagesSum, workersSum ];
		} catch (error) {
			return [ 0,0 ];
		}
	}

	static async getAddressesapi(api) {
		if (!api || api.length === 0) {
			return [];
		}

		let newapi = "";

		// 创建一个AbortController对象，用于控制fetch请求的取消
		const controller = new AbortController();

		const timeout = setTimeout(() => {
			controller.abort(); // 取消所有请求
		}, 2000); // 2秒后触发

		try {
			// 使用Promise.allSettled等待所有API请求完成，无论成功或失败
			// 对api数组进行遍历，对每个API地址发起fetch请求
			const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
				method: 'get',
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;',
					'User-Agent': 'CF-Workers-edgetunnel/cmliu'
				},
				signal: controller.signal // 将AbortController的信号量添加到fetch请求中，以便于需要时可以取消请求
			}).then(response => response.ok ? response.text() : Promise.reject())));

			// 遍历所有响应
			for (const response of responses) {
				// 检查响应状态是否为'fulfilled'，即请求成功完成
				if (response.status === 'fulfilled') {
					// 获取响应的内容
					const content = await response.value;
					newapi += content + '\n';
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			// 无论成功或失败，最后都清除设置的超时定时器
			clearTimeout(timeout);
		}

		const newAddressesapi = await this.ADD(newapi);

		// 返回处理后的结果
		return newAddressesapi;
	}

	static async getAddressescsv(tls) {
		if (!AppParam.addressescsv || AppParam.addressescsv.length === 0) {
			return [];
		}

		let newAddressescsv = [];

		for (const csvUrl of AppParam.addressescsv) {
			try {
				const response = await fetch(csvUrl);

				if (!response.ok) {
					console.error('获取CSV地址时出错:', response.status, response.statusText);
					continue;
				}

				const text = await response.text();// 使用正确的字符编码解析文本内容
				let lines;
				if (text.includes('\r\n')){
					lines = text.split('\r\n');
				} else {
					lines = text.split('\n');
				}

				// 检查CSV头部是否包含必需字段
				const header = lines[0].split(',');
				const tlsIndex = header.indexOf('TLS');

				const ipAddressIndex = 0;// IP地址在 CSV 头部的位置
				const portIndex = 1;// 端口在 CSV 头部的位置
				const dataCenterIndex = tlsIndex + 1; // 数据中心是 TLS 的后一个字段

				if (tlsIndex === -1) {
					console.error('CSV文件缺少必需的字段');
					continue;
				}

				// 从第二行开始遍历CSV行
				for (let i = 1; i < lines.length; i++) {
					const columns = lines[i].split(',');
					const speedIndex = columns.length - 1; // 最后一个字段
					// 检查TLS是否为"TRUE"且速度大于DLS
					if (columns[tlsIndex].toUpperCase() === tls && parseFloat(columns[speedIndex]) > AppParam.DLS) {
						const ipAddress = columns[ipAddressIndex];
						const port = columns[portIndex];
						const dataCenter = columns[dataCenterIndex];

						const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
						newAddressescsv.push(formattedAddress);
					}
				}
			} catch (error) {
				console.error('获取CSV地址时出错:', error);
				continue;
			}
		}

		return newAddressescsv;
	}

	static subAddresses(host, UUID, noTLS, newAddressesapi, newAddressescsv, newAddressesnotlsapi , newAddressesnotlscsv) {
		const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
		AppParam.addresses = AppParam.addresses.concat(newAddressesapi);
		AppParam.addresses = AppParam.addresses.concat(newAddressescsv);
		let notlsresponseBody ;
		if (noTLS == 'true'){
			AppParam.addressesnotls = AppParam.addressesnotls.concat(newAddressesnotlsapi);
			AppParam.addressesnotls = AppParam.addressesnotls.concat(newAddressesnotlscsv);
			const uniqueAddressesnotls = [...new Set(AppParam.addressesnotls)];

			notlsresponseBody = uniqueAddressesnotls.map(address => {
				let port = "-1";
				let addressid = address;

				const match = addressid.match(regex);
				if (!match) {
					if (address.includes(':') && address.includes('#')) {
						const parts = address.split(':');
						address = parts[0];
						const subParts = parts[1].split('#');
						port = subParts[0];
						addressid = subParts[1];
					} else if (address.includes(':')) {
						const parts = address.split(':');
						address = parts[0];
						port = parts[1];
					} else if (address.includes('#')) {
						const parts = address.split('#');
						address = parts[0];
						addressid = parts[1];
					}

					if (addressid.includes(':')) {
						addressid = addressid.split(':')[0];
					}
				} else {
					address = match[1];
					port = match[2] || port;
					addressid = match[3] || address;
				}

				const httpPorts = ["8080","8880","2052","2082","2086","2095"];
				if (!CommonUtils.isValidIPv4(address) && port == "-1") {
					for (let httpPort of httpPorts) {
						if (address.includes(httpPort)) {
							port = httpPort;
							break;
						}
					}
				}
				if (port == "-1") port = "80";

				let 伪装域名 = host ;
				let 最终路径 = '/?ed=2560' ;
				let 节点备注 = '';
				const 协议类型 = atob(啥啥啥_写的这是啥啊);

				const vlessLink = `${协议类型}://${UUID}@${address}:${port}?encryption=none&security=&type=ws&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;

				return vlessLink;

			}).join('\n');

		}

		// 使用Set对象去重
		const uniqueAddresses = [...new Set(AppParam.addresses)];

		const responseBody = uniqueAddresses.map(address => {
			let port = "-1";
			let addressid = address;

			const match = addressid.match(regex);
			if (!match) {
				if (address.includes(':') && address.includes('#')) {
					const parts = address.split(':');
					address = parts[0];
					const subParts = parts[1].split('#');
					port = subParts[0];
					addressid = subParts[1];
				} else if (address.includes(':')) {
					const parts = address.split(':');
					address = parts[0];
					port = parts[1];
				} else if (address.includes('#')) {
					const parts = address.split('#');
					address = parts[0];
					addressid = parts[1];
				}

				if (addressid.includes(':')) {
					addressid = addressid.split(':')[0];
				}
			} else {
				address = match[1];
				port = match[2] || port;
				addressid = match[3] || address;
			}

			const httpsPorts = ["2053","2083","2087","2096","8443"];
			if (!CommonUtils.isValidIPv4(address) && port == "-1") {
				for (let httpsPort of httpsPorts) {
					if (address.includes(httpsPort)) {
						port = httpsPort;
						break;
					}
				}
			}
			if (port == "-1") port = "443";

			let 伪装域名 = host ;
			let 最终路径 = '/?ed=2560' ;
			let 节点备注 = '';

			if(AppParam.proxyhosts.length > 0 && (伪装域名.includes('.workers.dev') || 伪装域名.includes('pages.dev'))) {
				最终路径 = `/${伪装域名}${最终路径}`;
				伪装域名 = AppParam.proxyhosts[Math.floor(Math.random() * AppParam.proxyhosts.length)];
				节点备注 = ` 已启用临时域名中转服务，请尽快绑定自定义域！`;
			}

			const 协议类型 = atob(啥啥啥_写的这是啥啊);
			const vlessLink = `${协议类型}://${UUID}@${address}:${port}?encryption=none&security=tls&sni=${伪装域名}&fp=random&type=ws&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;

			return vlessLink;
		}).join('\n');

		let base64Response = responseBody; // 重新进行 Base64 编码
		if(noTLS == 'true') base64Response += `\n${notlsresponseBody}`;
		return btoa(base64Response);
	}

}
