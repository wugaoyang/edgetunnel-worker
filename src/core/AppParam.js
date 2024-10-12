
//程序参数配置
export default class AppParam {

static userID = '80cd4a77-141a-43c9-991b-08263cfe9c10';
// 小白勿动，该地址并不影响你的网速，这是给CF代理使用的。
// 'cdn.xn--b6gac.eu.org,
// cdn-all.xn--b6gac.eu.org,
// workers.cloudflare.cyou'
// 5.161.191.23
static proxyIP = '142.171.140.152';

static sub = '';// 避免项目被滥用，现已取消内置订阅器
static subconverter = 'SUBAPI.fxxk.dedyn.io';// clash订阅转换后端，目前使用CM的订阅转换功能。自带虚假uuid和host订阅。
static subconfig = "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini"; //订阅配置文件
static subProtocol = 'https';
// The user name and password do not contain special characters
// Setting the address will ignore proxyIP
// Example:  user:pass@host:port  or  host:port
static socks5Address = '';

static parsedSocks5Address = {};
static enableSocks = false;

// 虚假uuid和hostname，用于发送给配置生成服务
static fakeUserID ;
static fakeHostName ;
static noTLS = 'false';
static expire = 4102329600;//2099-12-31
static proxyIPs;
static socks5s;
static go2Socks5s = [
	'*ttvnw.net',
];
static addresses = [
	//当sub为空时启用本地优选域名/优选IP，若不带端口号 TLS默认端口为443，#号后为备注别名
	/*
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
	'104.17.0.0#IPv4',
	'[2606:4700::]#IPv6'
	*/
];
static addressesapi = [];
static addressesnotls = [
	//当sub为空且域名带有"worker"字样时启用本地优选域名/优选IP，若不带端口号 noTLS默认端口为80，#号后为备注别名
	/*
	'usa.visa.com',
	'myanmar.visa.com:8080',
	'www.visa.com.tw:8880',
	'www.visaeurope.ch:2052',
	'www.visa.com.br:2082',
	'www.visasoutheasteurope.com:2086',
	'[2606:4700::1]:2095#IPv6'
	*/
];
static addressesnotlsapi = [];
static addressescsv = [];
static DLS = 8;
static FileName = 'edgetunnel';
static BotToken ='';
static ChatID ='';
static proxyhosts = [];//本地代理域名池
static proxyhostsURL = 'https://raw.githubusercontent.com/cmliu/CFcdnVmess2sub/main/proxyhosts';//在线代理域名池URL
static RproxyIP = 'false';
}

