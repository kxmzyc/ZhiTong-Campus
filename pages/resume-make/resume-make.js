const api = require('../../utils/api');

Page({
  data: {
    resumeId: null, // 后端简历ID（数据库真实ID）
    resumeName: '我的简历1',
    completion: 0,
    completionAnim: 0,
    editingName: false,
    nameDraft: '',
    user: {
      name: '',
      school: '',
      degree: '',
      gradYear: ''
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
    ],
    educationList: [] // 教育经历列表
  },

  getResumeStorageKey() {
    return `resume_data_${this.data.resumeId}`;
  },

  loadUserBasic() {
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      return;
    }

    // 先从登录信息中获取头像和昵称
    const app = getApp();
    const loginUserInfo = app.getUserInfo();

    // 设置登录用户的头像
    if (loginUserInfo && loginUserInfo.avatar) {
      this.setData({
        avatarPath: loginUserInfo.avatar
      });
    }

    // 从后端加载简历基本信息
    api.getResumeDetail(resumeId)
      .then(res => {
        if (res.code === 200 && res.data) {
          const resume = res.data;
          this.setData({
            user: {
              name: resume.name || (loginUserInfo ? loginUserInfo.nickname : ''),
              school: resume.school || '',
              degree: resume.education || '',
              gradYear: resume.graduationDate ? new Date(resume.graduationDate).getFullYear() : ''
            }
          });
        } else {
          // 如果后端没有数据，使用登录信息
          if (loginUserInfo) {
            this.setData({
              user: {
                name: loginUserInfo.nickname || '',
                school: '',
                degree: '',
                gradYear: ''
              }
            });
          }
        }
      })
      .catch(err => {
        console.error('加载用户基本信息失败:', err);
        // 失败时也尝试使用登录信息
        if (loginUserInfo) {
          this.setData({
            user: {
              name: loginUserInfo.nickname || '',
              school: '',
              degree: '',
              gradYear: ''
            }
          });
        }
      });
  },

  loadResume() {
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      wx.showToast({
        title: '简历ID无效',
        icon: 'none'
      });
      return;
    }

    // 从后端API加载简历数据
    api.getResumeDetail(resumeId)
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
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      console.error('简历ID无效，无法保存');
      return;
    }

    // 保存到后端API
    api.updateResume({
      id: resumeId,
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
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      return 0;
    }

    // 从后端API获取数据计算完成度
    Promise.all([
      api.getResumeDetail(resumeId),
      api.getEducationList(resumeId),
      api.getInternshipList(resumeId),
      api.getProjectList(resumeId),
      api.getAwardList(resumeId)
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
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      return;
    }

    // 从后端API获取数据计算完成度
    Promise.all([
      api.getResumeDetail(resumeId),
      api.getEducationList(resumeId),
      api.getInternshipList(resumeId),
      api.getProjectList(resumeId),
      api.getAwardList(resumeId)
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
    const resumeId = this.data.resumeId;

    if (!resumeId) {
      wx.showToast({
        title: '简历ID无效',
        icon: 'none'
      });
      return;
    }

    if (type === 'education') {
      // 跳转到教育经历添加页面（不传 educationId，表示新增）
      wx.navigateTo({
        url: `/pages/resume-education/resume-education?id=${resumeId}`
      });
      return;
    }

    if (type === 'internship') {
      wx.navigateTo({
        url: `/pages/resume-internship/resume-internship?id=${resumeId}`
      });
      return;
    }

    if (type === 'campus') {
      wx.navigateTo({
        url: `/pages/resume-campus/resume-campus?id=${resumeId}`
      });
      return;
    }

    if (type === 'project') {
      wx.navigateTo({
        url: `/pages/resume-project/resume-project?id=${resumeId}`
      });
      return;
    }

    if (type === 'awards') {
      wx.navigateTo({
        url: `/pages/resume-awards/resume-awards?id=${resumeId}`
      });
      return;
    }

    if (type === 'skills') {
      wx.navigateTo({
        url: `/pages/resume-skills/resume-skills?id=${resumeId}`
      });
      return;
    }

    if (type === 'summary') {
      wx.navigateTo({
        url: `/pages/resume-summary/resume-summary?id=${resumeId}`
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/resume-section/resume-section?type=${encodeURIComponent(type || '')}&title=${encodeURIComponent(title || '')}&id=${resumeId}`
    });
  },

  goToProfileEdit() {
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      wx.showToast({
        title: '简历ID无效',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/resume-basic-edit/resume-basic-edit?id=${resumeId}`
    });
  },

  onPreview() {
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      wx.showToast({
        title: '简历ID不存在',
        icon: 'none'
      });
      return;
    }

    // 直接跳转到预览页面
    wx.navigateTo({
      url: `/pages/resume-preview/resume-preview?id=${resumeId}`
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

  // 加载教育经历列表
  loadEducationList() {
    const resumeId = this.data.resumeId;
    if (!resumeId) {
      return;
    }

    api.getEducationList(resumeId)
      .then(res => {
        if (res.code === 200 && res.data) {
          this.setData({
            educationList: res.data
          });
        }
      })
      .catch(err => {
        console.error('加载教育经历列表失败:', err);
      });
  },

  // 编辑教育经历
  onEditEducation(e) {
    const id = e.currentTarget.dataset.id;
    const resumeId = this.data.resumeId;

    if (!id || !resumeId) return;

    wx.navigateTo({
      url: `/pages/resume-education/resume-education?id=${resumeId}&educationId=${id}`
    });
  },

  // 删除教育经历
  onDeleteEducation(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条教育经历吗？',
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: (res) => {
        if (!res.confirm) return;

        wx.showLoading({ title: '删除中...' });

        api.deleteEducation(id)
          .then(res => {
            wx.hideLoading();
            if (res.code === 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });

              // 重新加载列表
              this.loadEducationList();
              this.refreshCompletion();
            } else {
              wx.showToast({
                title: res.message || '删除失败',
                icon: 'none'
              });
            }
          })
          .catch(err => {
            wx.hideLoading();
            console.error('删除教育经历失败:', err);
            wx.showToast({
              title: '删除失败，请检查网络',
              icon: 'none'
            });
          });
      }
    });
  },

  onLoad(options) {
    const resumeId = options && options.id ? parseInt(options.id) : null;

    if (!resumeId) {
      wx.showToast({
        title: '简历ID无效',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.reLaunch({
              url: '/pages/resume/resume'
            });
          }
        });
      }, 2000);
      return;
    }

    this.setData({
      resumeId: resumeId
    });

    this.loadUserBasic();
    this.loadResume();
    this.refreshCompletion();
  },

  onShow() {
    this.loadUserBasic();
    this.loadResume();
    this.loadEducationList(); // 加载教育经历列表
    this.refreshCompletion();
  }
});
