// API 配置
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * 发送 HTTP 请求
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
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
