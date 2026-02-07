Page({
  data: {
    statusBarHeight: 0
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '已收藏'
    });
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
