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
      title: '已投递'
    });
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
