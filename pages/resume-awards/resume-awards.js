Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    pointsBalance: 0,

    awardName: '',
    awardYear: '',
    awardMonth: '',

    fileNames: [],
    files: [],

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

  getStorageKey() {
    return `resume_awards_${this.data.resumeId}`;
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
    const key = this.getStorageKey();
    const data = wx.getStorageSync(key) || {};

    const files = Array.isArray(data.files) ? data.files : [];
    const fileNames = files.map(f => (f && (f.name || f.fileName)) || '').filter(Boolean);

    this.setData({
      awardName: data.awardName || '',
      awardYear: data.awardYear ? String(data.awardYear) : '',
      awardMonth: data.awardMonth ? String(data.awardMonth) : '',
      files,
      fileNames
    });
  },

  saveAwards() {
    const key = this.getStorageKey();
    const stored = wx.getStorageSync(key) || {};

    const data = {
      ...stored,
      awardName: this.data.awardName,
      awardYear: this.data.awardYear,
      awardMonth: this.data.awardMonth,
      files: this.data.files
    };

    wx.setStorageSync(key, data);
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

  onChooseFile() {
    wx.chooseMessageFile({
      count: 3,
      type: 'file',
      success: (res) => {
        const files = (res && res.tempFiles) ? res.tempFiles : [];
        const fileNames = files.map(f => (f && (f.name || f.fileName)) || '').filter(Boolean);
        const errors = this.data.errors || {};
        this.setData({
          files,
          fileNames,
          errors: {
            ...errors,
            files: ''
          }
        });
      }
    });
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

  validateForm() {
    const errors = {};

    if (!String(this.data.awardName || '').trim()) errors.awardName = '请输入奖励名称';
    if (!String(this.data.awardYear || '').trim()) errors.awardDate = '请选择时间';

    const files = Array.isArray(this.data.files) ? this.data.files : [];
    if (!files.length) errors.files = '请上传至少1个附件';

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

    this.initPicker();
    this.loadPointsBalance();
    this.loadAwards();
  },

  onShow() {
    this.loadPointsBalance();
    this.loadAwards();
  }
});
