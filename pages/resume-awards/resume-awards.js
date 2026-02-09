const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    backendResumeId: null,
    awardId: null,
    pointsBalance: 0,

    awardName: '',
    awardLevel: '',
    awardYear: '',
    awardMonth: '',

    description: '',
    descCount: 0,

    sheetVisible: false,
    sheetTitle: '',
    pickerValue: [0, 0],
    years: [],
    months: [],
    tempYearIndex: 0,
    tempMonthIndex: 0,
    errors: {}
  },

  noop() {},

  loadPointsBalance() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    this.setData({
      pointsBalance: Number.isFinite(balance) ? balance : 0
    });
  },

  loadAwards() {
    const resumeId = this.data.resumeId;
    const match = String(resumeId).match(/^r_(\d+)$/);
    if (!match) {
      return;
    }

    const backendId = parseInt(match[1]);
    this.setData({ backendResumeId: backendId });

    // 从后端API加载获奖经历
    wx.showLoading({ title: '加载中...' });

    api.getAwardList(backendId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 加载第一条获奖经历
          const data = res.data[0];
          this.setData({ awardId: data.id });

          const parseYearMonth = (s) => {
            if (!s) return { y: '', m: '' };
            const d = new Date(s);
            return {
              y: String(d.getFullYear()),
              m: String(d.getMonth() + 1).padStart(2, '0')
            };
          };

          const date = parseYearMonth(data.awardDate);

          this.setData({
            awardName: data.name || '',
            awardLevel: data.level || '',
            awardYear: date.y,
            awardMonth: date.m,
            description: data.description || '',
            descCount: String(data.description || '').length
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载获奖经历失败:', err);
      });
  },

  saveAwards() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      wx.showToast({ title: '简历ID无效', icon: 'none' });
      return;
    }

    // 构建保存数据
    const data = {
      resumeId: backendId,
      name: this.data.awardName || '',
      level: this.data.awardLevel || '',
      awardDate: this.data.awardYear && this.data.awardMonth
        ? `${this.data.awardYear}-${this.data.awardMonth}-01`
        : null,
      description: this.data.description || ''
    };

    wx.showLoading({ title: '保存中...' });

    // 判断是创建还是更新
    const apiCall = this.data.awardId
      ? api.updateAward({ id: this.data.awardId, ...data })
      : api.createAward(data);

    apiCall
      .then(res => {
        wx.hideLoading();
        if (res.code === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });

          // 保存成功后更新awardId
          if (res.data && res.data.id) {
            this.setData({ awardId: res.data.id });
          }
        } else {
          wx.showToast({
            title: res.message || '保存失败',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('保存获奖经历失败:', err);
        wx.showToast({
          title: '保存失败，请检查网络',
          icon: 'none'
        });
      });
  },

  initPicker() {
    const now = new Date();
    const start = now.getFullYear() - 10;
    const end = now.getFullYear() + 10;

    const years = [];
    for (let y = start; y <= end; y += 1) {
      years.push(String(y));
    }

    const months = [];
    for (let mo = 1; mo <= 12; mo += 1) {
      months.push(mo < 10 ? `0${mo}` : String(mo));
    }

    this.setData({
      years,
      months
    });
  },

  onAwardInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      awardName: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        awardName: ''
      }
    });
  },

  onAwardBlur() {
    const value = String(this.data.awardName || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        awardName: value ? '' : '请输入奖励名称'
      }
    });
  },

  onLevelInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      awardLevel: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        awardLevel: ''
      }
    });
  },

  onLevelBlur() {
    const value = String(this.data.awardLevel || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        awardLevel: value ? '' : '请输入奖励等级'
      }
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
        description: value ? '' : '请输入获奖描述'
      }
    });
  },

  openTimeSheet() {
    const { years, months } = this.data;

    let yi = 0;
    let mi = 0;

    if (this.data.awardYear) {
      const found = years.indexOf(String(this.data.awardYear));
      if (found >= 0) yi = found;
    }

    if (this.data.awardMonth) {
      const foundM = months.indexOf(String(this.data.awardMonth));
      if (foundM >= 0) mi = foundM;
    }

    this.setData({
      sheetVisible: true,
      sheetTitle: '选择时间',
      pickerValue: [yi, mi],
      tempYearIndex: yi,
      tempMonthIndex: mi
    });
  },

  onPickerChange(e) {
    const value = (e.detail && e.detail.value) || [0, 0];
    const yi = Array.isArray(value) && value.length ? (value[0] || 0) : 0;
    const mi = Array.isArray(value) && value.length > 1 ? (value[1] || 0) : 0;

    this.setData({
      pickerValue: [yi, mi],
      tempYearIndex: yi,
      tempMonthIndex: mi
    });
  },

  onSheetMaskTap() {
    this.validateOnSheetClose();
    this.closeSheet();
  },

  onSheetCancel() {
    this.validateOnSheetClose();
    this.closeSheet();
  },

  validateOnSheetClose() {
    const errors = this.data.errors || {};
    const next = { ...errors };

    if (!String(this.data.awardYear || '').trim()) next.awardDate = '请选择时间';

    this.setData({ errors: next });
  },

  closeSheet() {
    this.setData({
      sheetVisible: false,
      sheetTitle: ''
    });
  },

  onSheetConfirm() {
    const yi = this.data.tempYearIndex || 0;
    const mi = this.data.tempMonthIndex || 0;

    const year = (this.data.years || [])[yi] || '';
    const month = (this.data.months || [])[mi] || '';

    const errors = this.data.errors || {};

    this.setData({
      awardYear: year,
      awardMonth: month,
      errors: {
        ...errors,
        awardDate: ''
      }
    });

    this.closeSheet();
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
          awardName: '',
          awardLevel: '',
          awardYear: '',
          awardMonth: '',
          description: '',
          descCount: 0
        });
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },

  validateForm() {
    const errors = {};

    if (!String(this.data.awardName || '').trim()) errors.awardName = '请输入奖励名称';
    if (!String(this.data.awardLevel || '').trim()) errors.awardLevel = '请输入奖励等级';
    if (!String(this.data.awardYear || '').trim()) errors.awardDate = '请选择时间';
    if (!String(this.data.description || '').trim()) errors.description = '请输入获奖描述';

    return errors;
  },

  onSave() {
    const errors = this.validateForm();
    if (Object.keys(errors).length) {
      this.setData({ errors });
      return;
    }
    this.setData({ errors: {} });
    this.saveAwards();
    // 注意:保存成功的提示和跳转已经在saveAwards方法中处理
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

    this.initPicker();
    this.loadPointsBalance();
    this.loadAwards();
  },

  onShow() {
    this.loadPointsBalance();
    this.loadAwards();
  }
});
