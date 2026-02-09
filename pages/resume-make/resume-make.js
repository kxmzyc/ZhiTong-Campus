Page({
  data: {
    resumeId: '',
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
    const resumes = wx.getStorageSync(this.getResumeStorageKey()) || [];
    const target = (resumes || []).find(r => r && r.id === resumeId);

    if (!target) {
      return;
    }

    this.setData({
      resumeName: target.name || this.data.resumeName,
      completion: Number(target.completion) || 0
    });
  },

  saveResumePatch(patch) {
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

    const basic = wx.getStorageSync('profile_basic_info') || {};
    const profileOk = this.isFilled(basic.name)
      && this.isFilled(basic.gender)
      && this.isFilled(basic.degree)
      && this.isFilled(basic.school)
      && this.isFilled(basic.major)
      && this.isFilled(basic.gradYear)
      && this.isFilled(basic.gradMonth)
      && this.isArrayFilled(basic.intendedPositions)
      && this.isArrayFilled(basic.intendedIndustries)
      && this.isArrayFilled(basic.intendedCities);

    const read = (type) => {
      const key = this.getSectionStorageKey(type);
      if (!key) return {};
      return wx.getStorageSync(key) || {};
    };

    const edu = read('education');
    const educationOk = !!(edu.school && edu.school.name)
      && !!(edu.degree && edu.degree.name)
      && !!(edu.majorCategory && edu.majorCategory.name)
      && this.isFilled(edu.majorName)
      && this.isFilled(edu.startYear)
      && this.isFilled(edu.startMonth)
      && this.isFilled(edu.endYear)
      && this.isFilled(edu.endMonth)
      && !!(edu.studyMode && edu.studyMode.name)
      && this.isFilled(edu.description);

    const intern = read('internship');
    const internshipOk = this.isFilled(intern.companyName)
      && this.isFilled(intern.positionName)
      && this.isFilled(intern.startYear)
      && this.isFilled(intern.startMonth)
      && this.isFilled(intern.endYear)
      && this.isFilled(intern.endMonth)
      && this.isFilled(intern.description);

    const campus = read('campus');
    const campusOk = this.isFilled(campus.schoolName)
      && this.isFilled(campus.orgName)
      && this.isFilled(campus.roleName)
      && this.isFilled(campus.startYear)
      && this.isFilled(campus.startMonth)
      && this.isFilled(campus.endYear)
      && this.isFilled(campus.endMonth)
      && this.isFilled(campus.description);

    const project = read('project');
    const projectOk = this.isFilled(project.projectName)
      && this.isFilled(project.roleName)
      && this.isFilled(project.startYear)
      && this.isFilled(project.startMonth)
      && this.isFilled(project.endYear)
      && this.isFilled(project.endMonth)
      && this.isFilled(project.description);

    const awards = read('awards');
    const awardsOk = this.isFilled(awards.awardName)
      && this.isFilled(awards.awardYear)
      && this.isFilled(awards.awardMonth)
      && this.isArrayFilled(awards.files);

    const skills = read('skills');
    const skillsOk = this.isFilled(skills.langSkill)
      && this.isFilled(skills.techSkill)
      && this.isFilled(skills.traitSkill)
      && this.isFilled(skills.hobbySkill);

    const summary = read('summary');
    const summaryOk = this.isFilled(summary.description);

    let total = 0;
    if (profileOk) total += weights.profile;
    if (educationOk) total += weights.education;
    if (internshipOk) total += weights.internship;
    if (campusOk) total += weights.campus;
    if (projectOk) total += weights.project;
    if (awardsOk) total += weights.awards;
    if (skillsOk) total += weights.skills;
    if (summaryOk) total += weights.summary;

    return Math.max(0, Math.min(100, total));
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
    const next = this.computeCompletion();
    this.animateCompletionTo(next);
    this.saveResumePatch({ completion: next });
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
    // 从 resumeId (格式: r_1) 中提取 backendId (格式: 1)
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      wx.showToast({
        title: '简历ID不存在',
        icon: 'none'
      });
      return;
    }

    // 提取数字部分作为 backendId
    const backendId = resumeId.replace(/^r_/, '');

    if (!backendId) {
      wx.showToast({
        title: '无效的简历ID',
        icon: 'none'
      });
      return;
    }

    // 跳转到简历预览页面
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
