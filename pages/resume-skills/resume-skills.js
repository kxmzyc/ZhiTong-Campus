const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    resumeId: '',
    backendResumeId: null,

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

  loadSkills() {
    const resumeId = this.data.resumeId;
    const match = String(resumeId).match(/^r_(\d+)$/);
    if (!match) {
      return;
    }

    const backendId = parseInt(match[1]);
    this.setData({ backendResumeId: backendId });

    // 从后端API加载简历数据,获取skills字段
    wx.showLoading({ title: '加载中...' });

    api.getResumeDetail(backendId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          const skills = res.data.skills || '';
          // 解析技能文本,按行分割
          const lines = skills.split('\n').filter(line => line.trim());

          this.setData({
            langSkill: lines[0] || '',
            techSkill: lines[1] || '',
            traitSkill: lines[2] || '',
            hobbySkill: lines[3] || ''
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载技能信息失败:', err);
      });
  },

  saveSkills() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      wx.showToast({ title: '简历ID无效', icon: 'none' });
      return;
    }

    // 构建技能文本
    const skillsParts = [];
    if (this.data.langSkill) skillsParts.push(this.data.langSkill);
    if (this.data.techSkill) skillsParts.push(this.data.techSkill);
    if (this.data.traitSkill) skillsParts.push(this.data.traitSkill);
    if (this.data.hobbySkill) skillsParts.push(this.data.hobbySkill);

    const data = {
      id: backendId,
      skills: skillsParts.join('\n')
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
        console.error('保存技能信息失败:', err);
        wx.showToast({
          title: '保存失败，请检查网络',
          icon: 'none'
        });
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
    // 注意:保存成功的提示已经在saveSkills方法中处理
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

    this.loadSkills();
  },

  onShow() {
    this.loadSkills();
  }
});
