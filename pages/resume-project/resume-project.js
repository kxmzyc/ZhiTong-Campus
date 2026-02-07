Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    pointsBalance: 0,

    projectName: '',
    roleName: '',

    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: '',

    description: '',
    descCount: 0,

    sheetVisible: false,
    sheetType: '',
    sheetTitle: '',
    pickerValue: [0, 0],
    gradYears: [],
    gradMonths: [],
    tempGradYearIndex: 0,
    tempGradMonthIndex: 0,
    errors: {}
  },

  getStorageKey() {
    return `resume_project_${this.data.resumeId}`;
  },

  noop() {},

  loadPointsBalance() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    this.setData({
      pointsBalance: Number.isFinite(balance) ? balance : 0
    });
  },

  parseYearMonth(s) {
    const str = String(s || '');
    const m = str.match(/^(\d{4})-(\d{2})/);
    if (!m) return { y: '', m: '' };
    return { y: m[1], m: m[2] };
  },

  loadProject() {
    const key = this.getStorageKey();
    const data = wx.getStorageSync(key) || {};

    const start = data.startYear
      ? { y: String(data.startYear), m: String(data.startMonth || '') }
      : this.parseYearMonth(data.startDate);
    const end = data.endYear
      ? { y: String(data.endYear), m: String(data.endMonth || '') }
      : this.parseYearMonth(data.endDate);

    const description = data.description || '';

    this.setData({
      projectName: data.projectName || '',
      roleName: data.roleName || '',
      startYear: start.y,
      startMonth: start.m,
      endYear: end.y,
      endMonth: end.m,
      description,
      descCount: String(description).length
    });
  },

  saveProject() {
    const key = this.getStorageKey();
    const stored = wx.getStorageSync(key) || {};

    const data = {
      ...stored,
      projectName: this.data.projectName,
      roleName: this.data.roleName,
      startYear: this.data.startYear,
      startMonth: this.data.startMonth,
      endYear: this.data.endYear,
      endMonth: this.data.endMonth,
      description: this.data.description
    };

    wx.setStorageSync(key, data);
  },

  initGradPicker() {
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
      gradYears: years,
      gradMonths: months
    });
  },

  onProjectInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      projectName: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        projectName: ''
      }
    });
  },

  onProjectBlur() {
    const value = String(this.data.projectName || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        projectName: value ? '' : '请输入项目名称'
      }
    });
  },

  onRoleInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      roleName: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        roleName: ''
      }
    });
  },

  onRoleBlur() {
    const value = String(this.data.roleName || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        roleName: value ? '' : '请输入担任职务'
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
        description: value ? '' : '请输入项目简介'
      }
    });
  },

  openStartSheet() {
    this.openGradSheet('start', '选择开始时间', this.data.startYear, this.data.startMonth);
  },

  openEndSheet() {
    this.openGradSheet('end', '选择结束时间', this.data.endYear, this.data.endMonth);
  },

  openGradSheet(type, title, y, m) {
    const { gradYears, gradMonths } = this.data;

    let yi = 0;
    let mi = 0;

    if (y) {
      const found = gradYears.indexOf(String(y));
      if (found >= 0) yi = found;
    }

    if (m) {
      const foundM = gradMonths.indexOf(String(m));
      if (foundM >= 0) mi = foundM;
    }

    this.setData({
      sheetVisible: true,
      sheetType: type,
      sheetTitle: title,
      pickerValue: [yi, mi],
      tempGradYearIndex: yi,
      tempGradMonthIndex: mi
    });
  },

  onGradPickerChange(e) {
    const value = (e.detail && e.detail.value) || [0, 0];
    const yi = Array.isArray(value) && value.length ? (value[0] || 0) : 0;
    const mi = Array.isArray(value) && value.length > 1 ? (value[1] || 0) : 0;

    this.setData({
      pickerValue: [yi, mi],
      tempGradYearIndex: yi,
      tempGradMonthIndex: mi
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
    const type = this.data.sheetType;
    if (!type) return;

    const errors = this.data.errors || {};
    const next = { ...errors };

    if (type === 'start' && !String(this.data.startYear || '').trim()) next.startDate = '请选择开始时间';
    if (type === 'end' && !String(this.data.endYear || '').trim()) next.endDate = '请选择结束时间';

    if (String(this.data.startYear || '').trim() && String(this.data.endYear || '').trim()) {
      const s = Number(this.data.startYear) * 100 + Number(this.data.startMonth || 0);
      const e = Number(this.data.endYear) * 100 + Number(this.data.endMonth || 0);
      if (Number.isFinite(s) && Number.isFinite(e) && s >= e) next.dateRange = '开始时间需早于结束时间';
    }

    this.setData({ errors: next });
  },

  closeSheet() {
    this.setData({
      sheetVisible: false,
      sheetType: '',
      sheetTitle: ''
    });
  },

  onSheetConfirm() {
    const type = this.data.sheetType;

    const yi = this.data.tempGradYearIndex || 0;
    const mi = this.data.tempGradMonthIndex || 0;
    const year = (this.data.gradYears || [])[yi] || '';
    const month = (this.data.gradMonths || [])[mi] || '';
    const errors = this.data.errors || {};

    if (type === 'start') {
      this.setData({
        startYear: year,
        startMonth: month,
        errors: {
          ...errors,
          startDate: '',
          dateRange: ''
        }
      });
    } else if (type === 'end') {
      this.setData({
        endYear: year,
        endMonth: month,
        errors: {
          ...errors,
          endDate: '',
          dateRange: ''
        }
      });
    }

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

    if (!String(this.data.projectName || '').trim()) errors.projectName = '请输入项目名称';
    if (!String(this.data.roleName || '').trim()) errors.roleName = '请输入担任职务';

    if (!String(this.data.startYear || '').trim()) errors.startDate = '请选择开始时间';
    if (!String(this.data.endYear || '').trim()) errors.endDate = '请选择结束时间';

    if (String(this.data.startYear || '').trim() && String(this.data.endYear || '').trim()) {
      const s = Number(this.data.startYear) * 100 + Number(this.data.startMonth || 0);
      const e = Number(this.data.endYear) * 100 + Number(this.data.endMonth || 0);
      if (Number.isFinite(s) && Number.isFinite(e) && s >= e) {
        errors.dateRange = '开始时间需早于结束时间';
      }
    }

    if (!String(this.data.description || '').trim()) errors.description = '请输入项目简介';
    return errors;
  },

  onSave() {
    const errors = this.validateForm();
    if (Object.keys(errors).length) {
      this.setData({ errors });
      return;
    }
    this.setData({ errors: {} });
    this.saveProject();
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

    this.initGradPicker();
    this.loadPointsBalance();
    this.loadProject();
  },

  onShow() {
    this.loadPointsBalance();
    this.loadProject();
  }
});
