const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    userId: 1, // 临时使用固定用户ID
    favorites: [],
    loading: false
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });
    this.loadFavorites();
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '已收藏'
    });
    this.loadFavorites();
  },

  /**
   * 加载收藏列表
   */
  loadFavorites() {
    this.setData({ loading: true });

    api.getFavoriteList(this.data.userId)
      .then(res => {
        this.setData({ loading: false });
        if (res.code === 200 && res.data) {
          this.setData({
            favorites: res.data
          });
        }
      })
      .catch(err => {
        this.setData({ loading: false });
        console.error('加载收藏列表失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  /**
   * 取消收藏
   */
  onRemoveFavorite(e) {
    const jobId = e.currentTarget.dataset.jobId;

    wx.showModal({
      title: '确认取消',
      content: '确定要取消收藏吗？',
      confirmText: '取消收藏',
      confirmColor: '#ef4444',
      success: (res) => {
        if (!res.confirm) return;

        wx.showLoading({ title: '处理中...' });

        api.removeFavorite(this.data.userId, jobId)
          .then(res => {
            wx.hideLoading();
            if (res.code === 200) {
              wx.showToast({
                title: '取消成功',
                icon: 'success'
              });
              // 重新加载列表
              this.loadFavorites();
            }
          })
          .catch(err => {
            wx.hideLoading();
            console.error('取消收藏失败:', err);
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            });
          });
      }
    });
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
