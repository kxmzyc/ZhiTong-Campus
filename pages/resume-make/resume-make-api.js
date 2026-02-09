const api = require('../../utils/api');

Page({
  data: {
    resumeId: null,
    userId: 1,
    loading: true,

    // 简历基本信息
    name: '',
    gender: '',
    phone: '',
    email: '',
    education: '',
    school: '',
    major: '',
    graduationDate: '',
    jobIntention: '',
    expectedCity: '',
    expectedSalary: '',
    skills: '',
    selfEvaluation: '',

    // 子模块列表
    educationList: [],
    internshipList: [],
    projectList: [],
    awardList: [],

    // 完成度
    completion: 0
  },

  onLoad(options) {
    // 从URL参数获取简历ID (格式: r_1)
    const localId = options.id || '';
    const match = localId.match(/^r_(\d+)$/);

    if (match) {
      const backendId = parseInt(match[1]);
      this.setData({ resumeId: backendId });
      this.loadAllData();
    } else {
      // 如果没有ID，创建新简历
      this.createNewResume();
    }
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (this.data.resumeId) {
      this.loadAllData();
    }
  },

  /**
   * 创建新简历
   */
  createNewResume() {
    wx.showLoading({ title: '创建中...' });

    api.createResume({
      userId: this.data.userId,
      name: '我的简历'
    })
    .then(res => {
      wx.hideLoading();
      if (res.code === 200 && res.data) {
        this.setData({
          resumeId: res.data.id,
          name: res.data.name || '',
          loading: false
        });
        wx.showToast({
          title: '创建成功',
          icon: 'success'
        });
      }
    })
    .catch(err => {
      wx.hideLoading();
      console.error('创建简历失败:', err);
      wx.showToast({
        title: '创建失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    });
  },

  /**
   * 加载所有数据
   */
  loadAllData() {
    wx.showLoading({ title: '加载中...' });

    Promise.all([
      api.getResumeDetail(this.data.resumeId),
      api.getEducationList(this.data.resumeId),
      api.getInternshipList(this.data.resumeId),
      api.getProjectList(this.data.resumeId),
      api.getAwardList(this.data.resumeId)
    ])
    .then(([resumeRes, eduRes, internRes, projRes, awardRes]) => {
      wx.hideLoading();

      // 处理简历基本信息
      if (resumeRes.code === 200 && resumeRes.data) {
        const resume = resumeRes.data;
        this.setData({
          name: resume.name || '',
          gender: resume.gender || '',
          phone: resume.phone || '',
          email: resume.email || '',
          education: resume.education || '',
          school: resume.school || '',
          major: resume.major || '',
          graduationDate: resume.graduationDate || '',
          jobIntention: resume.jobIntention || '',
          expectedCity: resume.expectedCity || '',
          expectedSalary: resume.expectedSalary || '',
          skills: resume.skills || '',
          selfEvaluation: resume.selfEvaluation || ''
        });
      }

      // 处理子模块列表
      this.setData({
        educationList: (eduRes.code === 200 && eduRes.data) || [],
        internshipList: (internRes.code === 200 && internRes.data) || [],
        projectList: (projRes.code === 200 && projRes.data) || [],
        awardList: (awardRes.code === 200 && awardRes.data) || [],
        loading: false
      });

      this.calculateCompletion();
    })
    .catch(err => {
      wx.hideLoading();
      console.error('加载简历失败:', err);
      wx.showToast({
        title: '加载失败，请检查网络',
        icon: 'none'
      });
      this.setData({ loading: false });
    });
  },

  /**
   * 计算完成度
   */
  calculateCompletion() {
    let score = 0;

    if (this.data.name) score += 15;
    if (this.data.phone) score += 10;
    if (this.data.email) score += 10;
    if (this.data.education) score += 10;
    if (this.data.school) score += 10;
    if (this.data.jobIntention) score += 10;
    if (this.data.educationList.length > 0) score += 15;
    if (this.data.internshipList.length > 0) score += 10;
    if (this.data.projectList.length > 0) score += 5;
    if (this.data.skills) score += 5;

    this.setData({ completion: Math.min(100, score) });
  },

  /**
   * 编辑基本信息
   */
  onEditBasicInfo() {
    wx.navigateTo({
      url: `/pages/resume-basic-edit/resume-basic-edit?id=${this.data.resumeId}`
    });
  },

  /**
   * 编辑教育经历
   */
  onEditEducation() {
    wx.navigateTo({
      url: `/pages/resume-education-list/resume-education-list?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑实习经历
   */
  onEditInternship() {
    wx.navigateTo({
      url: `/pages/resume-internship-list/resume-internship-list?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑项目经历
   */
  onEditProject() {
    wx.navigateTo({
      url: `/pages/resume-project-list/resume-project-list?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑获奖经历
   */
  onEditAward() {
    wx.navigateTo({
      url: `/pages/resume-award-list/resume-award-list?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑技能
   */
  onEditSkills() {
    wx.navigateTo({
      url: `/pages/resume-text-edit/resume-text-edit?id=${this.data.resumeId}&type=skills&title=技能特长`
    });
  },

  /**
   * 编辑自我评价
   */
  onEditSelfEvaluation() {
    wx.navigateTo({
      url: `/pages/resume-text-edit/resume-text-edit?id=${this.data.resumeId}&type=selfEvaluation&title=自我评价`
    });
  },

  /**
   * 预览简历
   */
  onPreview() {
    if (!this.data.resumeId) {
      wx.showToast({
        title: '简历ID不存在',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/resume-preview/resume-preview?id=${this.data.resumeId}`
    });
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.reLaunch({
          url: '/pages/resume/resume'
        });
      }
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

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile?from=resume'
    });
  }
});
