// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    from: '',
    user: {
      name: '管理员',
      school: '江夏学院',
      degree: '本科',
      gradYear: '2023',
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

    const basic = wx.getStorageSync('profile_basic_info') || {};
    const defaults = this.data.user || {};
    const name = basic.name || defaults.name;
    const school = basic.school || defaults.school;
    const degree = basic.degree || defaults.degree;
    const gradYear = basic.gradYear || defaults.gradYear;
    const gradDate = basic.gradYear && basic.gradMonth ? `${basic.gradYear}-${basic.gradMonth}` : (basic.gradDate || '----');

    this.setData({
      user: {
        name,
        school,
        degree,
        gradYear,
        gradDate
      },
      avatarPath: basic.avatarPath || ''
    });
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

  onEditProfile() {
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit'
    });
  },

  goApplied() {
    wx.navigateTo({
      url: '/pages/profile-applied/profile-applied'
    });
  },

  goPending() {
    wx.navigateTo({
      url: '/pages/profile-pending/profile-pending'
    });
  },

  goFavorite() {
    wx.navigateTo({
      url: '/pages/profile-favorite/profile-favorite'
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (!res.confirm) return;
        wx.showToast({
          title: '已退出',
          icon: 'success',
          duration: 400
        });
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }, 150);
      }
    });
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