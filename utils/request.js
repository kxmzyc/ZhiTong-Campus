// 云托管环境配置
const ENV_ID = 'prod-8g1wu4fze02dd0a5';
const SERVICE_NAME = 'springboot-g2yz';
const API_PREFIX = '/api';

/**
 * 将对象转换为 URL 查询字符串
 */
function buildQueryString(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  const query = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  return query ? `?${query}` : '';
}

/**
 * 发送 HTTP 请求（使用微信云托管 callContainer，无需配置域名白名单）
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    let path = `${API_PREFIX}${url}`;
    let requestData = options.data || {};

    // GET 请求将参数拼接到路径上
    if (options.method === 'GET' && requestData && Object.keys(requestData).length > 0) {
      path += buildQueryString(requestData);
      requestData = {};
    }

    wx.cloud.callContainer({
      config: { env: ENV_ID },
      path: path,
      method: options.method || 'GET',
      data: requestData,
      header: {
        'content-type': 'application/json',
        'X-WX-SERVICE': SERVICE_NAME,
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

/**
 * GET 请求
 */
function get(url, data = {}) {
  return request(url, {
    method: 'GET',
    data
  });
}

/**
 * POST 请求
 */
function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    data
  });
}

/**
 * PUT 请求
 */
function put(url, data = {}) {
  return request(url, {
    method: 'PUT',
    data
  });
}

/**
 * DELETE 请求
 */
function del(url, data = {}) {
  return request(url, {
    method: 'DELETE',
    data
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  del
};
