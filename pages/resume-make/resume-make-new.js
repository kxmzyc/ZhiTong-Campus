const api = require('../../utils/api');

Page({
  data: {
    resumeId: null, // 后端简历ID
    loading: true,
    userId: 1, // TODO: 从登录信息获取

    // 基本信息
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
    expectedSalary: '',
    selfEvaluation: '',
    skills: '',

    // 子模块数据
    educationList: [],
    internshipList: [],
    projectList: [],
    awardList: [],

    // UI状态
    completion: 0,
    statusBarHeight: 0
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });

    // 从URL参数获取简历ID (格式: r_1)
    const localId = options.id || '';
    const match = localId.match(/^r_(\d+)$/);

    if (match) {
      const backendId = parseInt(match[1]);
      this.setData({ resumeId: backendId });
      this.loadResumeData();
    } else {
      // 如果没有ID，创建新简历
      this.createNewResume();
    }
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (this.data.resumeId) {
      this.loadResumeData();
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
    });
  },

  /**
   * 加载简历数据
   */
  loadResumeData() {
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
          birthDate: resume.birthDate || '',
          phone: resume.phone || '',
          email: resume.email || '',
          education: resume.education || '',
          school: resume.school || '',
          major: resume.major || '',
          graduationDate: resume.graduationDate || '',
          jobIntention: resume.jobIntention || '',
          expectedCity: resume.expectedCity || '',
          expectedSalary: resume.expectedSalary || '',
          selfEvaluation: resume.selfEvaluation || '',
          skills: resume.skills || ''
        });
      }

      // 处理教育经历
      if (eduRes.code === 200 && eduRes.data) {
        this.setData({ educationList: eduRes.data || [] });
      }

      // 处理实习经历
      if (internRes.code === 200 && internRes.data) {
        this.setData({ internshipList: internRes.data || [] });
      }

      // 处理项目经历
      if (projRes.code === 200 && projRes.data) {
        this.setData({ projectList: projRes.data || [] });
      }

      // 处理获奖经历
      if (awardRes.code === 200 && awardRes.data) {
        this.setData({ awardList: awardRes.data || [] });
      }

      this.setData({ loading: false });
      this.calculateCompletion();
    })
    .catch(err => {
      wx.hideLoading();
      console.error('加载简历失败:', err);
      wx.showToast({
        title: '加载失败',
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
    const weights = {
      name: 10,
      phone: 10,
      email: 10,
      education: 10,
      school: 10,
      major: 5,
      jobIntention: 10,
      expectedCity: 5,
      educationList: 15,
      internshipList: 10,
      projectList: 10,
      skills: 5
    };

    if (this.data.name) score += weights.name;
    if (this.data.phone) score += weights.phone;
    if (this.data.email) score += weights.email;
    if (this.data.education) score += weights.education;
    if (this.data.school) score += weights.school;
    if (this.data.major) score += weights.major;
    if (this.data.jobIntention) score += weights.jobIntention;
    if (this.data.expectedCity) score += weights.expectedCity;
    if (this.data.educationList.length > 0) score += weights.educationList;
    if (this.data.internshipList.length > 0) score += weights.internshipList;
    if (this.data.projectList.length > 0) score += weights.projectList;
    if (this.data.skills) score += weights.skills;

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
      url: `/pages/resume-education-edit/resume-education-edit?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑实习经历
   */
  onEditInternship() {
    wx.navigateTo({
      url: `/pages/resume-internship-edit/resume-internship-edit?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑项目经历
   */
  onEditProject() {
    wx.navigateTo({
      url: `/pages/resume-project-edit/resume-project-edit?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑获奖经历
   */
  onEditAward() {
    wx.navigateTo({
      url: `/pages/resume-award-edit/resume-award-edit?resumeId=${this.data.resumeId}`
    });
  },

  /**
   * 编辑技能
   */
  onEditSkills() {
    wx.navigateTo({
      url: `/pages/resume-skills-edit/resume-skills-edit?id=${this.data.resumeId}`
    });
  },

  /**
   * 编辑自我评价
   */
  onEditSelfEvaluation() {
    wx.navigateTo({
      url: `/pages/resume-summary-edit/resume-summary-edit?id=${this.data.resumeId}`
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

  /**
   * 导航到首页
   */
  goToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * 导航到校招
   */
  goToCampus() {
    wx.reLaunch({
      url: '/pages/campus/campus'
    });
  },

  /**
   * 导航到个人中心
   */
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile?from=resume'
    });
  }
});
