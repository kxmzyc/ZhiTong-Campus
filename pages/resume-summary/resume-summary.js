Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    pointsBalance: 0,

    description: '',
    descCount: 0,
    errors: {}
  },

  getStorageKey() {
    return `resume_summary_${this.data.resumeId}`;
  },

  loadPointsBalance() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    this.setData({
      pointsBalance: Number.isFinite(balance) ? balance : 0
    });
  },

  loadSummary() {
    const key = this.getStorageKey();
    const data = wx.getStorageSync(key) || {};
    const description = data.description || '';
    this.setData({
      description,
      descCount: String(description).length
    });
  },

  saveSummary() {
    const key = this.getStorageKey();
    const stored = wx.getStorageSync(key) || {};

    wx.setStorageSync(key, {
      ...stored,
      description: this.data.description
    });
  },

  onDescriptionInput(e) {
    const value = (e && e.detail && e.detail.value) || '';
    const errors = this.data.errors || {};
    this.setData({
      description: value,
      descCount: String(value).length,
      errors: {
        ...errors,
        description: ''
      }
    });
  },

  onDescriptionBlur() {
    const value = String(this.data.description || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        description: value ? '' : '请输入自我评价'
      }
    });
  },

  validateForm() {
    const errors = {};
    if (!String(this.data.description || '').trim()) errors.description = '请输入自我评价';
    return errors;
  },

  onOptimize() {
    wx.showToast({
      title: '优化功能稍后制作',
      icon: 'none'
    });
  },

  onGoPoints() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  goToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  goToCampus() {
    wx.reLaunch({
      url: '/pages/campus/campus'
    });
  },

  goToResume() {
    wx.reLaunch({
      url: '/pages/resume/resume'
    });
  },

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile?from=resume'
    });
  },

  onClearAll() {
    wx.showModal({
      title: '确认清除',
      content: '将清除本页面所有输入内容并返回，是否继续？',
      confirmText: '清除',
      confirmColor: '#ef4444',
      success: (res) => {
        if (!res.confirm) return;
        const key = this.getStorageKey();
        wx.removeStorageSync(key);
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },

  onSave() {
    const errors = this.validateForm();
    if (Object.keys(errors).length) {
      this.setData({ errors });
      return;
    }
    this.setData({ errors: {} });
    this.saveSummary();
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 800);
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const resumeId = (options && options.id) || '';

    this.setData({
      statusBarHeight: sys.statusBarHeight || 0,
      resumeId
    });

    this.loadPointsBalance();
    this.loadSummary();
  },

  onShow() {
    this.loadPointsBalance();
    this.loadSummary();
  }
});
