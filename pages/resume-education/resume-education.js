const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    backendResumeId: null,
    educationId: null, // 当前编辑的教育经历ID
    pointsBalance: 0,
    school: null,
    degree: null,
    majorCategory: null,
    majorName: '',
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: '',
    studyMode: null,
    description: '',
    schoolName: '',
    degreeName: '',
    majorCategoryName: '',
    studyModeName: '',
    descCount: 0,
    sheetVisible: false,
    sheetType: '',
    sheetTitle: '',

    pickerOptions: [],
    pickerValue: [0],
    tempPickerIndex: 0,

    gradYears: [],
    gradMonths: [],
    tempGradYearIndex: 0,
    tempGradMonthIndex: 0,

    schools: [],

    majorCategories: [],
    activeMajorCategoryKey: '',
    displayMajors: [],
    errors: {}
  },

  getEducationStorageKey() {
    return `resume_education_${this.data.resumeId}`;
  },

  loadEducation() {
    const resumeId = this.data.resumeId;
    const match = String(resumeId).match(/^r_(\d+)$/);
    if (!match) {
      return;
    }

    const backendId = parseInt(match[1]);
    this.setData({ backendResumeId: backendId });

    // 从后端API加载教育经历
    wx.showLoading({ title: '加载中...' });

    api.getEducationList(backendId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 加载第一条教育经历
          const data = res.data[0];
          this.setData({ educationId: data.id });

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
            school: data.school ? { name: data.school } : null,
            degree: data.education ? { name: data.education } : null,
            majorName: data.major || '',
            startYear: start.y,
            startMonth: start.m,
            endYear: end.y,
            endMonth: end.m,
            description: data.description || '',
            schoolName: data.school || '',
            degreeName: data.education || '',
            descCount: String(data.description || '').length
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载教育经历失败:', err);
      });
  },

  saveEducation() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      wx.showToast({ title: '简历ID无效', icon: 'none' });
      return;
    }

    // 构建保存数据
    const data = {
      resumeId: backendId,
      school: this.data.schoolName || '',
      major: this.data.majorName || '',
      education: this.data.degreeName || '',
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
    const apiCall = this.data.educationId
      ? api.updateEducation({ id: this.data.educationId, ...data })
      : api.createEducation(data);

    apiCall
      .then(res => {
        wx.hideLoading();
        if (res.code === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });

          // 保存成功后更新educationId
          if (res.data && res.data.id) {
            this.setData({ educationId: res.data.id });
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
        console.error('保存教育经历失败:', err);
        wx.showToast({
          title: '保存失败，请检查网络',
          icon: 'none'
        });
      });
  },

  noop() {},

  onMajorNameInput(e) {
    const next = e.detail.value || '';
    const errors = this.data.errors || {};
    this.setData({
      majorName: next,
      errors: {
        ...errors,
        majorName: ''
      }
    });
  },

  onMajorNameBlur() {
    const value = String(this.data.majorName || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        majorName: value ? '' : '请输入专业名称'
      }
    });
  },


  openDegreeSheet() {
    const options = ['本科', '硕士', '博士'];
    const current = this.data.degreeName;
    const idx = current ? Math.max(0, options.indexOf(current)) : 0;
    this.setData({
      sheetVisible: true,
      sheetType: 'degree',
      sheetTitle: '选择学历',
      pickerOptions: options,
      pickerValue: [idx],
      tempPickerIndex: idx
    });
  },

  openStudyModeSheet() {
    const options = ['全日制', '非全日制'];
    const current = this.data.studyModeName;
    const idx = current ? Math.max(0, options.indexOf(current)) : 0;
    this.setData({
      sheetVisible: true,
      sheetType: 'studyMode',
      sheetTitle: '选择学习方式',
      pickerOptions: options,
      pickerValue: [idx],
      tempPickerIndex: idx
    });
  },

  openStartGradSheet() {
    this.openGradSheet('startGrad', '选择入学时间', this.data.startYear, this.data.startMonth);
  },

  openEndGradSheet() {
    this.openGradSheet('endGrad', '选择毕业时间', this.data.endYear, this.data.endMonth);
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

  openSchoolSheet() {
    this.setData({
      sheetVisible: true,
      sheetType: 'school',
      sheetTitle: '选择学校'
    });
  },

  openMajorSheet() {
    this.setData({
      sheetVisible: true,
      sheetType: 'major',
      sheetTitle: '选择专业院系'
    });

    if (!this.data.activeMajorCategoryKey && this.data.majorCategories.length) {
      const firstKey = this.data.majorCategories[0].key;
      this.setData(
        {
          activeMajorCategoryKey: firstKey
        },
        () => this.refreshDisplayMajors()
      );
    } else {
      this.refreshDisplayMajors();
    }
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

    if (type === 'school' && !String(this.data.schoolName || '').trim()) next.schoolName = '请选择学校';
    if (type === 'degree' && !String(this.data.degreeName || '').trim()) next.degreeName = '请选择学历';
    if (type === 'major' && !String(this.data.majorCategoryName || '').trim()) next.majorCategoryName = '请选择专业类别';
    if (type === 'studyMode' && !String(this.data.studyModeName || '').trim()) next.studyModeName = '请选择学习方式';
    if (type === 'startGrad' && !String(this.data.startYear || '').trim()) next.startDate = '请选择入学时间';
    if (type === 'endGrad' && !String(this.data.endYear || '').trim()) next.endDate = '请选择毕业时间';

    if (String(this.data.startYear || '').trim() && String(this.data.endYear || '').trim()) {
      const s = Number(this.data.startYear) * 100 + Number(this.data.startMonth || 0);
      const e = Number(this.data.endYear) * 100 + Number(this.data.endMonth || 0);
      if (Number.isFinite(s) && Number.isFinite(e) && s >= e) next.dateRange = '入学时间需早于毕业时间';
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

  onPickerChange(e) {
    const value = (e.detail && e.detail.value) || [0];
    const idx = Array.isArray(value) && value.length ? value[0] : 0;
    this.setData({
      pickerValue: [idx],
      tempPickerIndex: idx
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

  onSheetConfirm() {
    const type = this.data.sheetType;

    if (type === 'degree' || type === 'studyMode') {
      const idx = this.data.tempPickerIndex || 0;
      const options = this.data.pickerOptions || [];
      const val = options[idx] || '';
      if (type === 'degree') {
        const errors = this.data.errors || {};
        this.setData({
          degree: val ? { name: val } : null,
          degreeName: val,
          errors: {
            ...errors,
            degreeName: ''
          }
        });
      } else {
        const errors = this.data.errors || {};
        this.setData({
          studyMode: val ? { name: val } : null,
          studyModeName: val,
          errors: {
            ...errors,
            studyModeName: ''
          }
        });
      }
      this.closeSheet();
      return;
    }

    if (type === 'startGrad' || type === 'endGrad') {
      const yi = this.data.tempGradYearIndex || 0;
      const mi = this.data.tempGradMonthIndex || 0;
      const year = (this.data.gradYears || [])[yi] || '';
      const month = (this.data.gradMonths || [])[mi] || '';

      const errors = this.data.errors || {};

      if (type === 'startGrad') {
        this.setData({
          startYear: year,
          startMonth: month,
          errors: {
            ...errors,
            startDate: '',
            dateRange: ''
          }
        });
      } else {
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
    }
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

  initSchools() {
    const schools = [
      '清华大学',
      '北京大学',
      '复旦大学',
      '上海交通大学',
      '浙江大学',
      '南京大学',
      '中国科学技术大学',
      '哈尔滨工业大学',
      '西安交通大学',
      '武汉大学',
      '华中科技大学',
      '中山大学',
      '四川大学',
      '山东大学',
      '厦门大学',
      '吉林大学',
      '南开大学',
      '同济大学',
      '北京航空航天大学',
      '北京理工大学',
      '天津大学',
      '东南大学',
      '华南理工大学',
      '重庆大学',
      '西北工业大学',
      '大连理工大学',
      '湖南大学',
      '中南大学',
      '电子科技大学',
      '华东师范大学',
      '北京师范大学',
      '中国人民大学',
      '北京邮电大学',
      '对外经济贸易大学',
      '中国政法大学',
      '中央财经大学',
      '北京交通大学',
      '上海财经大学',
      '华中师范大学',
      '东北大学',
      '兰州大学',
      '华东理工大学',
      '苏州大学',
      '暨南大学',
      '中国农业大学',
      '西南交通大学',
      '华南师范大学',
      '北京科技大学',
      '南京航空航天大学',
      '南京理工大学'
    ];

    this.setData({
      schools
    });
  },

  onSchoolPick(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const errors = this.data.errors || {};
    this.setData({
      school: { name },
      schoolName: name,
      errors: {
        ...errors,
        schoolName: ''
      }
    });
    this.closeSheet();
  },

  initMajorData() {
    const majorCategories = [
      { key: 'cs', name: '计算机' },
      { key: 'ee', name: '电子信息' },
      { key: 'biz', name: '经管' },
      { key: 'design', name: '设计' }
    ];

    this.majorMap = {
      cs: ['计算机科学与技术', '软件工程', '网络工程', '人工智能', '数据科学与大数据技术'],
      ee: ['电子信息工程', '通信工程', '自动化', '微电子科学与工程'],
      biz: ['工商管理', '会计学', '金融学', '经济学', '市场营销'],
      design: ['视觉传达设计', '产品设计', '数字媒体艺术', '工业设计']
    };

    this.setData({
      majorCategories,
      activeMajorCategoryKey: majorCategories.length ? majorCategories[0].key : ''
    }, () => this.refreshDisplayMajors());
  },

  onMajorCategoryTap(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeMajorCategoryKey) return;

    this.setData({
      activeMajorCategoryKey: key
    }, () => this.refreshDisplayMajors());
  },

  refreshDisplayMajors() {
    const key = this.data.activeMajorCategoryKey;
    const list = (this.majorMap && this.majorMap[key]) ? this.majorMap[key] : [];
    const displayMajors = list.map((name) => ({ name }));
    this.setData({
      displayMajors
    });
  },

  onMajorPick(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;
    const errors = this.data.errors || {};
    this.setData({
      majorCategory: { name },
      majorCategoryName: name,
      errors: {
        ...errors,
        majorCategoryName: ''
      }
    });
    this.closeSheet();
  },

  onDescriptionInput(e) {
    const value = (e && e.detail && e.detail.value) || '';
    const errors = this.data.errors || {};
    this.setData({
      description: value,
      descCount: String(value).length
      ,
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
        description: value ? '' : '请输入专业描述'
      }
    });
  },

  validateForm() {
    const errors = {};

    if (!String(this.data.schoolName || '').trim()) errors.schoolName = '请选择学校';
    if (!String(this.data.degreeName || '').trim()) errors.degreeName = '请选择学历';
    if (!String(this.data.majorCategoryName || '').trim()) errors.majorCategoryName = '请选择专业类别';
    if (!String(this.data.majorName || '').trim()) errors.majorName = '请输入专业名称';

    if (!String(this.data.startYear || '').trim()) errors.startDate = '请选择入学时间';
    if (!String(this.data.endYear || '').trim()) errors.endDate = '请选择毕业时间';

    if (String(this.data.startYear || '').trim() && String(this.data.endYear || '').trim()) {
      const s = Number(this.data.startYear) * 100 + Number(this.data.startMonth || 0);
      const e = Number(this.data.endYear) * 100 + Number(this.data.endMonth || 0);
      if (Number.isFinite(s) && Number.isFinite(e) && s >= e) {
        errors.dateRange = '入学时间需早于毕业时间';
      }
    }

    if (!String(this.data.studyModeName || '').trim()) errors.studyModeName = '请选择学习方式';
    if (!String(this.data.description || '').trim()) errors.description = '请输入专业描述';
    return errors;
  },

  onOptimize() {
    wx.showToast({
      title: '优化功能稍后制作',
      icon: 'none'
    });
  },

  loadPointsBalance() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    this.setData({
      pointsBalance: Number.isFinite(balance) ? balance : 0
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
        const key = this.getEducationStorageKey();
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
    this.saveEducation();
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
    this.initSchools();
    this.initMajorData();
    this.loadPointsBalance();
    this.loadEducation();
  },

  onShow() {
    this.loadPointsBalance();
    this.loadEducation();
  }
});
