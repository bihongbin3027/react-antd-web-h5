let baseUrl
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://172.16.15.29:8082/' // 美凤
  // baseUrl = 'http://172.16.15.16:8082/' // 良
  // baseUrl = 'http://192.168.81.200:8082/' // 玉强
  // baseUrl = 'http://wxjjb.szlgzyy.com/' // 正式环境
  // baseUrl = 'http://172.16.20.93:8082/' // 正式环境ip
  // baseUrl = 'http://120.78.199.19/' // 测试
  // baseUrl = 'https://yiyuan.dreamblue.net.cn/' // 外网测试
} else {
  baseUrl = 'https://yiyuan.dreamblue.net.cn/'
}

export default { baseUrl }
