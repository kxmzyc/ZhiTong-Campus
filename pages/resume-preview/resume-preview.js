const api = require('../../utils/api');

Page({
  data: {
    resumeId: null,
    loading: true,
    statusBarHeight: 0,
    safeAreaBottom: 0,
    // 基本信息
    resume: {},
    // 教育经历
    educationList: [],
    // 实习经历
    internshipList: [],
    // 项目经历
    projectList: [],
    // 获奖经历
    awardList: [],
    // 是否有内容
    hasContent: false
  },

  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 0,
      safeAreaBottom: systemInfo.safeArea ? systemInfo.screenHeight - systemInfo.safeArea.bottom : 0
    });

    const resumeId = options.id;
    if (resumeId) {
      this.setData({ resumeId: parseInt(resumeId) });
      this.loadResumePreview();
    } else {
      wx.showToast({
        title: '简历ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载简历预览数据
   */
  loadResumePreview() {
    this.setData({ loading: true });

    api.getResumePreview(this.data.resumeId)
      .then(res => {
        this.setData({ loading: false });
        if (res.code === 200 && res.data) {
          const data = res.data;
          const hasContent = this.checkHasContent(data);

          this.setData({
            resume: data.resume || {},
            educationList: data.educationList || [],
            internshipList: data.internshipList || [],
            projectList: data.projectList || [],
            awardList: data.awardList || [],
            hasContent: hasContent
          });
        }
      })
      .catch(err => {
        this.setData({ loading: false });
        console.error('加载简历预览失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  /**
   * 检查是否有内容
   */
  checkHasContent(data) {
    const resume = data.resume || {};
    const hasBasicInfo = resume.name || resume.phone || resume.email;
    const hasEducation = data.educationList && data.educationList.length > 0;
    const hasInternship = data.internshipList && data.internshipList.length > 0;
    const hasProject = data.projectList && data.projectList.length > 0;
    const hasAward = data.awardList && data.awardList.length > 0;
    const hasSelfEvaluation = resume.selfEvaluation;
    const hasSkills = resume.skills;

    return hasBasicInfo || hasEducation || hasInternship || hasProject || hasAward || hasSelfEvaluation || hasSkills;
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
  },

  /**
   * 格式化年龄
   */
  calculateAge(birthDate) {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age + '岁';
  },

  /**
   * 返回
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 编辑简历
   */
  onEdit() {
    wx.navigateTo({
      url: `/pages/resume-make/resume-make?id=r_${this.data.resumeId}`
    });
  },

  /**
   * 分享简历
   */
  onShare() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导出简历
   */
  onExport() {
    wx.showToast({
      title: '导出功能开发中',
      icon: 'none'
    });
  }
});
