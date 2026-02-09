const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    backendResumeId: null,
    internshipId: null, // 当前编辑的实习经历ID
    pointsBalance: 0,

    companyName: '',
    positionName: '',

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
    return `resume_internship_${this.data.resumeId}`;
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

  loadInternship() {
    const resumeId = this.data.resumeId;
    const match = String(resumeId).match(/^r_(\d+)$/);
    if (!match) {
      return;
    }

    const backendId = parseInt(match[1]);
    this.setData({ backendResumeId: backendId });

    // 从后端API加载实习经历
    wx.showLoading({ title: '加载中...' });

    api.getInternshipList(backendId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 加载第一条实习经历
          const data = res.data[0];
          this.setData({ internshipId: data.id });

          const parseYearMonth = (s) => {
            if (!s) return { y: '', m: '' };
            const d = new Date(s);
            return {
              y: String(d.getFullYear()),
              m: String(d.getMonth() + 1).padStart(2, '0')
            };
          };

          const start = parseYearMonth(data.startDate);
          const end = parseYearMonth(data.endDate);

          this.setData({
            companyName: data.company || '',
            positionName: data.position || '',
            startYear: start.y,
            startMonth: start.m,
            endYear: end.y,
            endMonth: end.m,
            description: data.description || '',
            descCount: String(data.description || '').length
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载实习经历失败:', err);
      });
  },

  saveInternship() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      wx.showToast({ title: '简历ID无效', icon: 'none' });
      return;
    }

    // 构建保存数据
    const data = {
      resumeId: backendId,
      company: this.data.companyName || '',
      position: this.data.positionName || '',
      startDate: this.data.startYear && this.data.startMonth
        ? `${this.data.startYear}-${this.data.startMonth}-01`
        : null,
      endDate: this.data.endYear && this.data.endMonth
        ? `${this.data.endYear}-${this.data.endMonth}-01`
        : null,
      description: this.data.description || ''
    };

    wx.showLoading({ title: '保存中...' });

    // 判断是创建还是更新
    const apiCall = this.data.internshipId
      ? api.updateInternship({ id: this.data.internshipId, ...data })
      : api.createInternship(data);

    apiCall
      .then(res => {
        wx.hideLoading();
        if (res.code === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });

          // 保存成功后更新internshipId
          if (res.data && res.data.id) {
            this.setData({ internshipId: res.data.id });
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
        console.error('保存实习经历失败:', err);
        wx.showToast({
          title: '保存失败，请检查网络',
          icon: 'none'
        });
      });
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

  onCompanyInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      companyName: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        companyName: ''
      }
    });
  },

  onCompanyBlur() {
    const value = String(this.data.companyName || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        companyName: value ? '' : '请输入公司名称'
      }
    });
  },

  onPositionInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      positionName: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        positionName: ''
      }
    });
  },

  onPositionBlur() {
    const value = String(this.data.positionName || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        positionName: value ? '' : '请输入职位名称'
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
        description: value ? '' : '请输入工作描述'
      }
    });
  },

  openStartSheet() {
    this.openGradSheet('start', '选择在职时间', this.data.startYear, this.data.startMonth);
  },

  openEndSheet() {
    this.openGradSheet('end', '选择离职时间', this.data.endYear, this.data.endMonth);
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

    if (type === 'start' && !String(this.data.startYear || '').trim()) next.startDate = '请选择在职时间';
    if (type === 'end' && !String(this.data.endYear || '').trim()) next.endDate = '请选择离职时间';

    if (String(this.data.startYear || '').trim() && String(this.data.endYear || '').trim()) {
      const s = Number(this.data.startYear) * 100 + Number(this.data.startMonth || 0);
      const e = Number(this.data.endYear) * 100 + Number(this.data.endMonth || 0);
      if (Number.isFinite(s) && Number.isFinite(e) && s >= e) next.dateRange = '在职时间需早于离职时间';
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

    if (!String(this.data.companyName || '').trim()) errors.companyName = '请输入公司名称';
    if (!String(this.data.positionName || '').trim()) errors.positionName = '请输入职位名称';

    if (!String(this.data.startYear || '').trim()) errors.startDate = '请选择在职时间';
    if (!String(this.data.endYear || '').trim()) errors.endDate = '请选择离职时间';

    if (String(this.data.startYear || '').trim() && String(this.data.endYear || '').trim()) {
      const s = Number(this.data.startYear) * 100 + Number(this.data.startMonth || 0);
      const e = Number(this.data.endYear) * 100 + Number(this.data.endMonth || 0);
      if (Number.isFinite(s) && Number.isFinite(e) && s >= e) {
        errors.dateRange = '在职时间需早于离职时间';
      }
    }

    if (!String(this.data.description || '').trim()) errors.description = '请输入工作描述';
    return errors;
  },

  onSave() {
    const errors = this.validateForm();
    if (Object.keys(errors).length) {
      this.setData({ errors });
      return;
    }
    this.setData({ errors: {} });
    this.saveInternship();
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
    this.loadInternship();
  },

  onShow() {
    this.loadPointsBalance();
    this.loadInternship();
  }
});
