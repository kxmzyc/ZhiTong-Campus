const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    backendResumeId: null,
    pointsBalance: 0,

    description: '',
    descCount: 0,
    errors: {}
  },

  loadPointsBalance() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    this.setData({
      pointsBalance: Number.isFinite(balance) ? balance : 0
    });
  },

  loadSummary() {
    const resumeId = this.data.resumeId;
    const match = String(resumeId).match(/^r_(\d+)$/);
    if (!match) {
      return;
    }

    const backendId = parseInt(match[1]);
    this.setData({ backendResumeId: backendId });

    // 从后端API加载简历数据,获取selfEvaluation字段
    wx.showLoading({ title: '加载中...' });

    api.getResumeDetail(backendId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          const description = res.data.selfEvaluation || '';
          this.setData({
            description,
            descCount: String(description).length
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载自我评价失败:', err);
      });
  },

  saveSummary() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      wx.showToast({ title: '简历ID无效', icon: 'none' });
      return;
    }

    const data = {
      id: backendId,
      selfEvaluation: this.data.description || ''
    };

    wx.showLoading({ title: '保存中...' });

    api.updateResume(data)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.message || '保存失败',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('保存自我评价失败:', err);
        wx.showToast({
          title: '保存失败，请检查网络',
          icon: 'none'
        });
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
        // 清空表单数据
        this.setData({
          description: '',
          descCount: 0
        });
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
    // 注意:保存成功的提示已经在saveSummary方法中处理
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
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
