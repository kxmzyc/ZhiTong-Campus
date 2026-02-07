Page({
  data: {
    statusBarHeight: 0,
    type: '',
    title: ''
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0,
      type: (options && options.type) || '',
      title: (options && options.title) || '模块'
    });
  }
});
