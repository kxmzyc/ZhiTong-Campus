Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',

    langSkill: '',
    techSkill: '',
    traitSkill: '',
    hobbySkill: '',
    errors: {}
  },

  noop() {},

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

  getStorageKey() {
    return `resume_skills_${this.data.resumeId}`;
  },

  loadSkills() {
    const key = this.getStorageKey();
    const data = wx.getStorageSync(key) || {};
    this.setData({
      langSkill: data.langSkill || '',
      techSkill: data.techSkill || '',
      traitSkill: data.traitSkill || '',
      hobbySkill: data.hobbySkill || ''
    });
  },

  saveSkills() {
    const key = this.getStorageKey();
    const stored = wx.getStorageSync(key) || {};

    wx.setStorageSync(key, {
      ...stored,
      langSkill: this.data.langSkill,
      techSkill: this.data.techSkill,
      traitSkill: this.data.traitSkill,
      hobbySkill: this.data.hobbySkill
    });
  },

  onLangInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      langSkill: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        langSkill: ''
      }
    });
  },

  onLangBlur() {
    const value = String(this.data.langSkill || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        langSkill: value ? '' : '请填写语言能力'
      }
    });
  },

  onTechInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      techSkill: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        techSkill: ''
      }
    });
  },

  onTechBlur() {
    const value = String(this.data.techSkill || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        techSkill: value ? '' : '请填写编程/软件'
      }
    });
  },

  onTraitInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      traitSkill: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        traitSkill: ''
      }
    });
  },

  onTraitBlur() {
    const value = String(this.data.traitSkill || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        traitSkill: value ? '' : '请填写性格特质'
      }
    });
  },

  onHobbyInput(e) {
    const errors = this.data.errors || {};
    this.setData({
      hobbySkill: (e && e.detail && e.detail.value) || '',
      errors: {
        ...errors,
        hobbySkill: ''
      }
    });
  },

  onHobbyBlur() {
    const value = String(this.data.hobbySkill || '').trim();
    const errors = this.data.errors || {};
    this.setData({
      errors: {
        ...errors,
        hobbySkill: value ? '' : '请填写兴趣爱好'
      }
    });
  },

  validateForm() {
    const errors = {};
    if (!String(this.data.langSkill || '').trim()) errors.langSkill = '请填写语言能力';
    if (!String(this.data.techSkill || '').trim()) errors.techSkill = '请填写编程/软件';
    if (!String(this.data.traitSkill || '').trim()) errors.traitSkill = '请填写性格特质';
    if (!String(this.data.hobbySkill || '').trim()) errors.hobbySkill = '请填写兴趣爱好';
    return errors;
  },

  onSave() {
    const errors = this.validateForm();
    if (Object.keys(errors).length) {
      this.setData({ errors });
      return;
    }
    this.setData({ errors: {} });
    this.saveSkills();
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

    this.loadSkills();
  },

  onShow() {
    this.loadSkills();
  }
});
