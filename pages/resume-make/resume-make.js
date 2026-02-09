const api = require('../../utils/api');

Page({
  data: {
    resumeId: '',
    backendResumeId: null, // 后端简历ID
    resumeName: '我的简历1',
    completion: 0,
    completionAnim: 0,
    editingName: false,
    nameDraft: '',
    user: {
      name: '管理员',
      school: '江夏学院',
      degree: '本科',
      gradYear: '2023'
    },
    avatarPath: '',
    sections: [
      { type: 'education', title: '教育信息', action: '＋' },
      { type: 'internship', title: '实习经历', action: '＋' },
      { type: 'campus', title: '学校经历', action: '＋' },
      { type: 'project', title: '项目经历', action: '＋' },
      { type: 'awards', title: '荣誉奖励', action: '＋' },
      { type: 'skills', title: '技能', action: '✎' },
      { type: 'summary', title: '自我评价', action: '✎' }
    ]
  },

  getResumeStorageKey() {
    return 'resume_list_v1';
  },

  loadUserBasic() {
    const basic = wx.getStorageSync('profile_basic_info') || {};
    const defaults = this.data.user || {};
    const name = basic.name || defaults.name;
    const school = basic.school || defaults.school;
    const degree = basic.degree || defaults.degree;
    const gradYear = basic.gradYear || defaults.gradYear;

    this.setData({
      user: {
        name,
        school,
        degree,
        gradYear
      },
      avatarPath: basic.avatarPath || ''
    });
  },

  loadResume() {
    const resumeId = this.data.resumeId;

    // 从resumeId提取后端ID (格式: r_1)
    const match = String(resumeId).match(/^r_(\d+)$/);
    if (!match) {
      return;
    }

    const backendId = parseInt(match[1]);
    this.setData({ backendResumeId: backendId });

    // 从后端API加载简历数据
    api.getResumeDetail(backendId)
      .then(res => {
        if (res.code === 200 && res.data) {
          this.setData({
            resumeName: res.data.name || this.data.resumeName
          });
        }
      })
      .catch(err => {
        console.error('加载简历失败:', err);
      });
  },

  saveResumePatch(patch) {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      return;
    }

    // 保存到后端API
    api.updateResume({
      id: backendId,
      ...patch
    })
    .then(res => {
      if (res.code === 200) {
        console.log('简历更新成功');
      }
    })
    .catch(err => {
      console.error('简历更新失败:', err);
    });

    // 同时保存到本地作为备份
    const resumeId = this.data.resumeId;
    const resumes = wx.getStorageSync(this.getResumeStorageKey()) || [];
    const next = (resumes || []).map(r => {
      if (!r || r.id !== resumeId) return r;
      return {
        ...r,
        ...patch
      };
    });
    wx.setStorageSync(this.getResumeStorageKey(), next);
  },

  getSectionStorageKey(type) {
    const id = this.data.resumeId;
    if (!id) return '';
    if (type === 'education') return `resume_education_${id}`;
    if (type === 'internship') return `resume_internship_${id}`;
    if (type === 'campus') return `resume_campus_${id}`;
    if (type === 'project') return `resume_project_${id}`;
    if (type === 'awards') return `resume_awards_${id}`;
    if (type === 'skills') return `resume_skills_${id}`;
    if (type === 'summary') return `resume_summary_${id}`;
    return '';
  },

  isFilled(v) {
    return String(v || '').trim().length > 0;
  },

  isArrayFilled(v) {
    return Array.isArray(v) && v.length > 0;
  },

  computeCompletion() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      return 0;
    }

    // 从后端API获取数据计算完成度
    Promise.all([
      api.getResumeDetail(backendId),
      api.getEducationList(backendId),
      api.getInternshipList(backendId),
      api.getProjectList(backendId),
      api.getAwardList(backendId)
    ])
    .then(([resumeRes, eduRes, internRes, projRes, awardRes]) => {
      const weights = {
        profile: 20,
        education: 15,
        internship: 15,
        campus: 10,
        project: 10,
        awards: 10,
        skills: 10,
        summary: 10
      };

      let total = 0;

      // 基本信息
      if (resumeRes.code === 200 && resumeRes.data) {
        const resume = resumeRes.data;
        const profileOk = resume.name && resume.phone && resume.email &&
                         resume.education && resume.school && resume.jobIntention;
        if (profileOk) total += weights.profile;

        if (resume.skills) total += weights.skills;
        if (resume.selfEvaluation) total += weights.summary;
      }

      // 教育经历
      if (eduRes.code === 200 && eduRes.data && eduRes.data.length > 0) {
        total += weights.education;
      }

      // 实习经历
      if (internRes.code === 200 && internRes.data && internRes.data.length > 0) {
        total += weights.internship;
      }

      // 项目经历
      if (projRes.code === 200 && projRes.data && projRes.data.length > 0) {
        total += weights.project;
      }

      // 获奖经历
      if (awardRes.code === 200 && awardRes.data && awardRes.data.length > 0) {
        total += weights.awards;
      }

      return Math.max(0, Math.min(100, total));
    })
    .catch(err => {
      console.error('计算完成度失败:', err);
      return 0;
    });

    // 临时返回0，实际值会通过Promise异步更新
    return 0;
  },

  animateCompletionTo(target) {
    const to = Math.max(0, Math.min(100, Number(target) || 0));
    const from = Number(this.data.completionAnim) || 0;
    if (from === to) {
      this.setData({ completion: to, completionAnim: to });
      return;
    }

    if (this._completionTimer) {
      clearInterval(this._completionTimer);
      this._completionTimer = null;
    }

    const start = Date.now();
    const duration = 420;
    const diff = to - from;

    this.setData({ completion: to });

    this._completionTimer = setInterval(() => {
      const t = (Date.now() - start) / duration;
      const p = t >= 1 ? 1 : t;
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + diff * eased);
      this.setData({ completionAnim: val });
      if (p >= 1) {
        clearInterval(this._completionTimer);
        this._completionTimer = null;
      }
    }, 16);
  },

  refreshCompletion() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      return;
    }

    // 从后端API获取数据计算完成度
    Promise.all([
      api.getResumeDetail(backendId),
      api.getEducationList(backendId),
      api.getInternshipList(backendId),
      api.getProjectList(backendId),
      api.getAwardList(backendId)
    ])
    .then(([resumeRes, eduRes, internRes, projRes, awardRes]) => {
      const weights = {
        profile: 20,
        education: 15,
        internship: 15,
        project: 10,
        awards: 10,
        skills: 10,
        summary: 10
      };

      let total = 0;

      // 基本信息
      if (resumeRes.code === 200 && resumeRes.data) {
        const resume = resumeRes.data;
        const profileOk = resume.name && resume.phone && resume.email &&
                         resume.education && resume.school && resume.jobIntention;
        if (profileOk) total += weights.profile;

        if (resume.skills) total += weights.skills;
        if (resume.selfEvaluation) total += weights.summary;
      }

      // 教育经历
      if (eduRes.code === 200 && eduRes.data && eduRes.data.length > 0) {
        total += weights.education;
      }

      // 实习经历
      if (internRes.code === 200 && internRes.data && internRes.data.length > 0) {
        total += weights.internship;
      }

      // 项目经历
      if (projRes.code === 200 && projRes.data && projRes.data.length > 0) {
        total += weights.project;
      }

      // 获奖经历
      if (awardRes.code === 200 && awardRes.data && awardRes.data.length > 0) {
        total += weights.awards;
      }

      const next = Math.max(0, Math.min(100, total));
      this.animateCompletionTo(next);
      this.saveResumePatch({ completion: next });
    })
    .catch(err => {
      console.error('刷新完成度失败:', err);
    });
  },

  onStartEditName() {
    this.setData({
      editingName: true,
      nameDraft: this.data.resumeName
    });
  },

  onNameInput(e) {
    this.setData({
      nameDraft: (e && e.detail && e.detail.value) || ''
    });
  },

  onConfirmEditName() {
    const draft = String(this.data.nameDraft || '').trim();
    const nextName = draft || this.data.resumeName;

    this.setData({
      resumeName: nextName,
      editingName: false
    });

    this.saveResumePatch({
      name: nextName
    });
  },

  goToSection(e) {
    const type = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.type;
    const title = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.title;

    if (type === 'education') {
      wx.navigateTo({
        url: `/pages/resume-education/resume-education?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }

    if (type === 'internship') {
      wx.navigateTo({
        url: `/pages/resume-internship/resume-internship?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }

    if (type === 'campus') {
      wx.navigateTo({
        url: `/pages/resume-campus/resume-campus?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }

    if (type === 'project') {
      wx.navigateTo({
        url: `/pages/resume-project/resume-project?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }

    if (type === 'awards') {
      wx.navigateTo({
        url: `/pages/resume-awards/resume-awards?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }

    if (type === 'skills') {
      wx.navigateTo({
        url: `/pages/resume-skills/resume-skills?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }

    if (type === 'summary') {
      wx.navigateTo({
        url: `/pages/resume-summary/resume-summary?id=${encodeURIComponent(this.data.resumeId)}`
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/resume-section/resume-section?type=${encodeURIComponent(type || '')}&title=${encodeURIComponent(title || '')}&id=${encodeURIComponent(this.data.resumeId)}`
    });
  },

  goToProfileEdit() {
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit'
    });
  },

  onPreview() {
    const backendId = this.data.backendResumeId;
    if (!backendId) {
      wx.showToast({
        title: '简历ID不存在',
        icon: 'none'
      });
      return;
    }

    // 直接跳转到预览页面
    wx.navigateTo({
      url: `/pages/resume-preview/resume-preview?id=${backendId}`
    });
  },

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
  },

  onLoad(options) {
    const resumeId = (options && options.id) || '';
    this.setData({
      resumeId
    });

    this.loadUserBasic();
    this.loadResume();
    this.refreshCompletion();
  },

  onShow() {
    this.loadUserBasic();
    this.loadResume();
    this.refreshCompletion();
  }
});
