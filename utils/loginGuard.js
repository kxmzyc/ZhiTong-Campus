/**
 * 登录守卫工具
 * 用于检查用户登录状态并引导到登录页面
 */

const app = getApp();

/**
 * 检查登录状态
 * @param {Function} callback - 已登录时的回调函数
 * @param {Boolean} showToast - 是否显示提示
 */
function checkLogin(callback, showToast = true) {
  const isLogin = app.checkLogin();

  if (isLogin) {
    // 已登录，执行回调
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  } else {
    // 未登录，跳转到登录页
    if (showToast) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      });
    }

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }, showToast ? 1500 : 0);

    return false;
  }
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象或 null
 */
function getUserInfo() {
  return app.getUserInfo();
}

/**
 * 获取用户ID
 * @returns {Number|null} 用户ID或 null
 */
function getUserId() {
  return app.getUserId();
}

/**
 * 退出登录
 */
function logout() {
  wx.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息
        app.clearUserInfo();

        wx.showToast({
          title: '已退出登录',
          icon: 'success',
          duration: 1500
        });

        // 跳转到登录页
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }, 1500);
      }
    }
  });
}

module.exports = {
  checkLogin,
  getUserInfo,
  getUserId,
  logout
};
