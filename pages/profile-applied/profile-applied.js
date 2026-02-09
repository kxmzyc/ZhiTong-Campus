const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    userId: 1, // 临时使用固定用户ID
    applications: [],
    loading: false
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });
    this.loadApplications();
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '已投递'
    });
    this.loadApplications();
  },

  /**
   * 加载申请列表
   */
  loadApplications() {
    this.setData({ loading: true });

    api.getApplicationList(this.data.userId)
      .then(res => {
        this.setData({ loading: false });
        if (res.code === 200 && res.data) {
          this.setData({
            applications: res.data
          });
        }
      })
      .catch(err => {
        this.setData({ loading: false });
        console.error('加载申请列表失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  /**
   * 撤销申请
   */
  onCancelApplication(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销该申请吗？',
      confirmText: '撤销',
      confirmColor: '#ef4444',
      success: (res) => {
        if (!res.confirm) return;

        wx.showLoading({ title: '撤销中...' });

        api.cancelApplication(id, this.data.userId)
          .then(res => {
            wx.hideLoading();
            if (res.code === 200) {
              wx.showToast({
                title: '撤销成功',
                icon: 'success'
              });
              // 重新加载列表
              this.loadApplications();
            }
          })
          .catch(err => {
            wx.hideLoading();
            console.error('撤销失败:', err);
            wx.showToast({
              title: '撤销失败',
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
