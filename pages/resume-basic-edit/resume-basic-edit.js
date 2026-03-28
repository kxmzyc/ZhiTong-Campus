const api = require('../../utils/api');
const app = getApp();

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
      resumeId: options.id ? parseInt(options.id) : null
    });

    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData() {
    if (!this.data.resumeId) {
      // 如果没有 resumeId，先根据 userId 获取简历列表
      this.loadResumeByUserId();
      return;
    }

    // 有 resumeId，直接加载简历详情
    this.loadResumeDetail(this.data.resumeId);
  },

  /**
   * 根据用户ID加载简历
   */
  loadResumeByUserId() {
    const userId = app.globalData.userId || wx.getStorageSync('userId') || 1;

    wx.showLoading({ title: '加载中...' });

    api.getResumeList(userId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 获取第一份简历
          const firstResume = res.data[0];
          this.setData({
            resumeId: firstResume.id
          });
          // 加载简历详情
          this.loadResumeDetail(firstResume.id);
        } else {
          // 没有简历，使用登录信息作为默认值
          this.loadDefaultUserInfo();
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载简历列表失败:', err);
        this.loadDefaultUserInfo();
      });
  },

  /**
   * 加载简历详情
   */
  loadResumeDetail(resumeId) {
    wx.showLoading({ title: '加载中...' });

    api.getResumeDetail(resumeId)
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
        } else {
          // 如果后端没有数据，使用登录信息作为默认值
          this.loadDefaultUserInfo();
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载简历详情失败:', err);
        this.loadDefaultUserInfo();
      });
  },

  /**
   * 加载默认用户信息
   */
  loadDefaultUserInfo() {
    const loginUserInfo = app.getUserInfo();
    if (loginUserInfo) {
      this.setData({
        form: {
          ...this.data.form,
          name: loginUserInfo.nickname || ''
        }
      });
    }
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
