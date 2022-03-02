export default {
  development: {
    // 开发环境接口请求
    // host: 'http://192.168.1.117:8389/v1',
    host: '/v1',
    // 开发环境 cdn 路径
    cdn: '',
  },
  test: {
    // 测试环境接口地址
    host: 'http://192.168.1.117:8389/v1',
    // 测试环境 cdn 路径
    cdn: '',
  },
  release: {
    // 正式环境接口地址
    host: 'http://192.168.1.117:8389/v1',
    // 正式环境 cdn 路径
    cdn: '',
  },
};
