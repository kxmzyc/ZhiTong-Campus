const api = require('../../utils/api');

Page({
  data: {
    resumeId: null,
    form: {
      name: '',
      gender: '',
      birthDate: '',
      phone: '',
      email: '',
      education: '',
      school: '',
      major: '',
      graduationDate: '',
      jobIntention: '',
      expectedCity: '',
      expectedSalary: ''
    },
    genderOptions: ['男', '女'],
    educationOptions: ['高中', '专科', '本科', '硕士', '博士'],
    statusBarHeight: 0
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0,
      resumeId: parseInt(options.id)
    });

    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    if (!this.data.resumeId) return;

    wx.showLoading({ title: '加载中...' });

    api.getResumeDetail(this.data.resumeId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          this.setData({
            form: {
              name: res.data.name || '',
              gender: res.data.gender || '',
              birthDate: res.data.birthDate || '',
              phone: res.data.phone || '',
              email: res.data.email || '',
              education: res.data.education || '',
              school: res.data.school || '',
              major: res.data.major || '',
              graduationDate: res.data.graduationDate || '',
              jobIntention: res.data.jobIntention || '',
              expectedCity: res.data.expectedCity || '',
              expectedSalary: res.data.expectedSalary || ''
            }
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载失败:', err);
      });
  },

  /**
   * 输入框变化
   */
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`form.${field}`]: value
    });
  },

  /**
   * 选择性别
   */
  onGenderChange(e) {
    const index = e.detail.value;
    this.setData({
      'form.gender': this.data.genderOptions[index]
    });
  },

  /**
   * 选择学历
   */
  onEducationChange(e) {
    const index = e.detail.value;
    this.setData({
      'form.education': this.data.educationOptions[index]
    });
  },

  /**
   * 选择出生日期
   */
  onBirthDateChange(e) {
    this.setData({
      'form.birthDate': e.detail.value
    });
  },

  /**
   * 选择毕业日期
   */
  onGraduationDateChange(e) {
    this.setData({
      'form.graduationDate': e.detail.value
    });
  },

  /**
   * 保存
   */
  onSave() {
    // 验证必填项
    if (!this.data.form.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '保存中...' });

    const data = {
      id: this.data.resumeId,
      ...this.data.form
    };

    api.updateResume(data)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('保存失败:', err);
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      });
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack();
  }
});
