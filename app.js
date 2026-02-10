App({
  onLaunch() {
    // 小程序启动时初始化
    this.initApp();
  },

  globalData: {
    userInfo: null,
    userId: null
  },

  /**
   * 初始化应用
   */
  initApp() {
    // 从本地缓存读取用户信息
    const storedUser = wx.getStorageSync('userInfo');
    if (storedUser) {
      this.globalData.userInfo = storedUser;
      this.globalData.userId = storedUser.id;
      console.log('已加载本地用户信息:', storedUser);
    } else {
      console.log('未找到本地用户信息');
    }
  },

  /**
   * 检查是否已登录
   */
  checkLogin() {
    return this.globalData.userInfo !== null;
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.globalData.userInfo;
  },

  /**
   * 获取用户ID
   */
  getUserId() {
    return this.globalData.userId;
  },

  /**
   * 设置用户信息
   */
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.userId = userInfo.id;

    // 保存到本地缓存
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('userId', userInfo.id);
  },

  /**
   * 清除用户信息（退出登录）
   */
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.userId = null;

    // 清除本地缓存
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('userId');
  }
});
