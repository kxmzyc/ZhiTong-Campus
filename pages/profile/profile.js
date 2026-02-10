// pages/profile/profile.js
const app = getApp();
const loginGuard = require('../../utils/loginGuard');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    from: '',
    isLogin: false,
    user: {
      name: '未登录',
      school: '请先登录',
      degree: '',
      gradYear: '',
      gradDate: '----'
    },
    avatarPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0,
      from: (options && options.from) || ''
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.setNavigationBarTitle({
      title: '我的'
    });

    // 检查登录状态
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const isLogin = app.checkLogin();
    this.setData({ isLogin });

    if (isLogin) {
      // 已登录，加载用户信息
      this.loadUserInfo();
    } else {
      // 未登录，显示默认信息
      this.setData({
        user: {
          name: '未登录',
          school: '请先登录',
          degree: '',
          gradYear: '',
          gradDate: '----'
        },
        avatarPath: ''
      });
    }
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = app.getUserInfo();

    if (userInfo) {
      // 从后端获取的用户信息
      this.setData({
        user: {
          name: userInfo.nickname || '微信用户',
          school: userInfo.school || '未设置',
          degree: userInfo.education || '',
          gradYear: userInfo.graduationYear || '',
          gradDate: userInfo.graduationDate || '----'
        },
        avatarPath: userInfo.avatar || ''
      });
    } else {
      // 兼容旧的本地存储方式
      const basic = wx.getStorageSync('profile_basic_info') || {};
      this.setData({
        user: {
          name: basic.name || '未设置',
          school: basic.school || '未设置',
          degree: basic.degree || '',
          gradYear: basic.gradYear || '',
          gradDate: basic.gradYear && basic.gradMonth ? `${basic.gradYear}-${basic.gradMonth}` : (basic.gradDate || '----')
        },
        avatarPath: basic.avatarPath || ''
      });
    }
  },

  onBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        const from = this.data.from;
        let url = '/pages/index/index';
        if (from === 'campus') url = '/pages/campus/campus';
        if (from === 'resume') url = '/pages/resume/resume';
        wx.reLaunch({
          url
        });
      }
    });
  },

  /**
   * 点击头像或昵称区域
   */
  onUserInfoTap() {
    if (!this.data.isLogin) {
      // 未登录，跳转到登录页
      wx.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      // 已登录，跳转到编辑页面
      this.onEditProfile();
    }
  },

  onEditProfile() {
    // 检查登录
    loginGuard.checkLogin(() => {
      wx.navigateTo({
        url: '/pages/profile-edit/profile-edit'
      });
    });
  },

  goApplied() {
    // 检查登录
    loginGuard.checkLogin(() => {
      wx.navigateTo({
        url: '/pages/profile-applied/profile-applied'
      });
    });
  },

  goPending() {
    // 检查登录
    loginGuard.checkLogin(() => {
      wx.navigateTo({
        url: '/pages/profile-pending/profile-pending'
      });
    });
  },

  goFavorite() {
    // 检查登录
    loginGuard.checkLogin(() => {
      wx.navigateTo({
        url: '/pages/profile-favorite/profile-favorite'
      });
    });
  },

  onLogout() {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '您还未登录',
        icon: 'none'
      });
      return;
    }

    // 使用登录守卫的退出登录方法
    loginGuard.logout();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})