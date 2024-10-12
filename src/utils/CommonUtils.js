// 预计算 0-255 每个字节的十六进制表示
import AppParam from '../core/AppParam';

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
	// (i + 256).toString(16) 确保总是得到两位数的十六进制
	// .slice(1) 删除前导的 "1"，只保留两位十六进制数
	byteToHex.push((i + 256).toString(16).slice(1));
}

export default class CommonUtils{

	static isValidIPv4(address) {
		const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return ipv4Regex.test(address);
	}

	/**
	 * 这不是真正的 UUID 验证，而是一个简化的版本
	 * @param {string} uuid 要验证的 UUID 字符串
	 * @returns {boolean} 如果字符串匹配 UUID 格式则返回 true，否则返回 false
	 */
	static isValidUUID(uuid) {
		// 定义一个正则表达式来匹配 UUID 格式
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		// 使用正则表达式测试 UUID 字符串
		return uuidRegex.test(uuid);
	}

	/**
	 * 将字节数组转换为 UUID 字符串，并验证其有效性
	 * 这是一个安全的函数，它确保返回的 UUID 格式正确
	 * @param {Uint8Array} arr 包含 UUID 字节的数组
	 * @param {number} offset 数组中 UUID 开始的位置，默认为 0
	 * @returns {string} 有效的 UUID 字符串
	 * @throws {TypeError} 如果生成的 UUID 字符串无效
	 */
	static stringify(arr, offset = 0) {
		// 使用不安全的函数快速生成 UUID 字符串
		const uuid = this.unsafeStringify(arr, offset);
		// 验证生成的 UUID 是否有效
		if (!CommonUtils.isValidUUID(uuid)) {
			// 原：throw TypeError("Stringified UUID is invalid");
			throw TypeError(`生成的 UUID 不符合规范 ${uuid}`);
			//uuid = userID;
		}
		return uuid;
	}
	/**
	 * 快速地将字节数组转换为 UUID 字符串，不进行有效性检查
	 * 这是一个底层函数，直接操作字节，不做任何验证
	 * @param {Uint8Array} arr 包含 UUID 字节的数组
	 * @param {number} offset 数组中 UUID 开始的位置，默认为 0
	 * @returns {string} UUID 字符串
	 */
	static unsafeStringify(arr, offset = 0) {
		// 直接从查找表中获取每个字节的十六进制表示，并拼接成 UUID 格式
		// 8-4-4-4-12 的分组是通过精心放置的连字符 "-" 实现的
		// toLowerCase() 确保整个 UUID 是小写的
		return (byteToHex[arr[offset - 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" +
			byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" +
			byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" +
			byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" +
			byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] +
			byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
	}
	/**
	 * 将 Base64 编码的字符串转换为 ArrayBuffer
	 *
	 * @param {string} base64Str Base64 编码的输入字符串
	 * @returns {{ earlyData: ArrayBuffer | undefined, error: Error | null }} 返回解码后的 ArrayBuffer 或错误
	 */
	static base64ToArrayBuffer(base64Str) {
		// 如果输入为空，直接返回空结果
		if (!base64Str) {
			return { error: null };
		}
		try {
			// Go 语言使用了 URL 安全的 Base64 变体（RFC 4648）
			// 这种变体使用 '-' 和 '_' 来代替标准 Base64 中的 '+' 和 '/'
			// JavaScript 的 atob 函数不直接支持这种变体，所以我们需要先转换
			base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');

			// 使用 atob 函数解码 Base64 字符串
			// atob 将 Base64 编码的 ASCII 字符串转换为原始的二进制字符串
			const decode = atob(base64Str);

			// 将二进制字符串转换为 Uint8Array
			// 这是通过遍历字符串中的每个字符并获取其 Unicode 编码值（0-255）来完成的
			const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));

			// 返回 Uint8Array 的底层 ArrayBuffer
			// 这是实际的二进制数据，可以用于网络传输或其他二进制操作
			return { earlyData: arryBuffer.buffer, error: null };
		} catch (error) {
			// 如果在任何步骤中出现错误（如非法 Base64 字符），则返回错误
			return { error };
		}
	}
	/**
	 * SOCKS5 代理地址解析器
	 * 此函数用于解析 SOCKS5 代理地址字符串，提取出用户名、密码、主机名和端口号
	 *
	 * @param {string} address SOCKS5 代理地址，格式可以是：
	 *   - "username:password@hostname:port" （带认证）
	 *   - "hostname:port" （不需认证）
	 *   - "username:password@[ipv6]:port" （IPv6 地址需要用方括号括起来）
	 */
	static socks5AddressParser(address) {
		// 使用 "@" 分割地址，分为认证部分和服务器地址部分
		// reverse() 是为了处理没有认证信息的情况，确保 latter 总是包含服务器地址
		let [latter, former] = address.split("@").reverse();
		let username, password, hostname, port;

		// 如果存在 former 部分，说明提供了认证信息
		if (former) {
			const formers = former.split(":");
			if (formers.length !== 2) {
				throw new Error('无效的 SOCKS 地址格式：认证部分必须是 "username:password" 的形式');
			}
			[username, password] = formers;
		}

		// 解析服务器地址部分
		const latters = latter.split(":");
		// 从末尾提取端口号（因为 IPv6 地址中也包含冒号）
		port = Number(latters.pop());
		if (isNaN(port)) {
			throw new Error('无效的 SOCKS 地址格式：端口号必须是数字');
		}

		// 剩余部分就是主机名（可能是域名、IPv4 或 IPv6 地址）
		hostname = latters.join(":");

		// 处理 IPv6 地址的特殊情况
		// IPv6 地址包含多个冒号，所以必须用方括号括起来，如 [2001:db8::1]
		const regex = /^\[.*\]$/;
		if (hostname.includes(":") && !regex.test(hostname)) {
			throw new Error('无效的 SOCKS 地址格式：IPv6 地址必须用方括号括起来，如 [2001:db8::1]');
		}

		//if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname)) hostname = `${atob('d3d3Lg==')}${hostname}${atob('LmlwLjA5MDIyNy54eXo=')}`;
		// 返回解析后的结果
		return {
			username,  // 用户名，如果没有则为 undefined
			password,  // 密码，如果没有则为 undefined
			hostname,  // 主机名，可以是域名、IPv4 或 IPv6 地址
			port,     // 端口号，已转换为数字类型
		}
	}
	/**
	 * 恢复被伪装的信息
	 * 这个函数用于将内容中的假用户ID和假主机名替换回真实的值
	 *
	 * @param {string} content 需要处理的内容
	 * @param {string} userID 真实的用户ID
	 * @param {string} hostName 真实的主机名
	 * @param {boolean} isBase64 内容是否是Base64编码的
	 * @returns {string} 恢复真实信息后的内容
	 */
	static revertFakeInfo(content, userID, hostName, isBase64) {
		if (isBase64) content = atob(content);  // 如果内容是Base64编码的，先解码

		// 使用正则表达式全局替换（'g'标志）
		// 将所有出现的假用户ID和假主机名替换为真实的值
		content = content.replace(new RegExp(AppParam.fakeUserID, 'g'), userID)
			.replace(new RegExp(AppParam.fakeHostName, 'g'), hostName);

		if (isBase64) content = btoa(content);  // 如果原内容是Base64编码的，处理完后再次编码

		return content;
	}
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
	/**
	 * 双重MD5哈希函数
	 * 这个函数对输入文本进行两次MD5哈希，增强安全性
	 * 第二次哈希使用第一次哈希结果的一部分作为输入
	 *
	 * @param {string} text 要哈希的文本
	 * @returns {Promise<string>} 双重哈希后的小写十六进制字符串
	 */
	static async MD5MD5(text) {
		const encoder = new TextEncoder();

		// 第一次MD5哈希
		const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
		const firstPassArray = Array.from(new Uint8Array(firstPass));
		const firstHex = firstPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

		// 第二次MD5哈希，使用第一次哈希结果的中间部分（索引7到26）
		const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
		const secondPassArray = Array.from(new Uint8Array(secondPass));
		const secondHex = secondPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

		return secondHex.toLowerCase();  // 返回小写的十六进制字符串
	}

}
