// pages/resume/resume.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resumes: [],
    displayResumes: [],
    canCreateMore: false,
    lastPickedFile: null
  },

  getResumeStorageKey() {
    return 'resume_list_v1';
  },

  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  parseDefaultNameIndex(name) {
    if (!name) return null;
    const m = String(name).match(/^我的简历(\d+)$/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) && n > 0 ? n : null;
  },

  getNextDefaultName(resumes) {
    const used = new Set();
    (resumes || []).forEach((r) => {
      const n = this.parseDefaultNameIndex(r && r.name);
      if (n) used.add(n);
    });

    let i = 1;
    while (used.has(i)) i += 1;
    return `我的简历${i}`;
  },

  createDefaultResume() {
    const now = new Date();
    return {
      id: `r_${Date.now()}`,
      name: this.getNextDefaultName(this.data && this.data.resumes),
      updatedAt: this.formatDate(now),
      completion: 0
    };
  },

  normalizeResumes(resumes) {
    const list = Array.isArray(resumes) ? resumes.slice() : [];
    const existingUsed = new Set();
    list.forEach((r) => {
      const n = this.parseDefaultNameIndex(r && r.name);
      if (n) existingUsed.add(n);
    });

    const getNextName = () => {
      let i = 1;
      while (existingUsed.has(i)) i += 1;
      existingUsed.add(i);
      return `我的简历${i}`;
    };

    return list.map((r) => {
      if (!r) return r;
      if (!r.name) {
        return {
          ...r,
          name: getNextName()
        };
      }
      return r;
    });
  },

  ensureAtLeastOneResume(resumes) {
    if (!Array.isArray(resumes) || resumes.length === 0) {
      const now = new Date();
      return [{
        id: `r_${Date.now()}`,
        name: '我的简历1',
        updatedAt: this.formatDate(now),
        completion: 0
      }];
    }
    return resumes;
  },

  computeViewState(resumes) {
    const safeResumes = this.normalizeResumes(this.ensureAtLeastOneResume(resumes));
    const first = safeResumes[0];
    const canCreateMore = !!first && Number(first.completion) >= 100;
    return {
      resumes: safeResumes,
      displayResumes: safeResumes,
      canCreateMore
    };
  },

  navigateToResumeMakeById(id) {
    if (!id) return;
    wx.navigateTo({
      url: `/pages/resume-make/resume-make?id=${encodeURIComponent(id)}`
    });
  },

  navigateToResumeMakeByIndex(index) {
    const resumes = this.data.resumes || [];
    const safeResumes = this.ensureAtLeastOneResume(resumes);
    const target = safeResumes[index];
    if (!target) return;
    this.navigateToResumeMakeById(target.id);
  },

  saveResumes(resumes) {
    wx.setStorageSync(this.getResumeStorageKey(), resumes);
  },

  loadResumes() {
    const resumes = wx.getStorageSync(this.getResumeStorageKey());
    const viewState = this.computeViewState(resumes);
    this.setData(viewState);
    this.saveResumes(viewState.resumes);
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

  navigateToResumeEdit(index) {
    this.navigateToResumeMakeByIndex(index);
  },

  onMakeResume() {
    this.navigateToResumeMakeByIndex(0);
  },

  pickFileWithConfirm(sourceLabel) {
    wx.showModal({
      title: '确认上传',
      content: `将从${sourceLabel}选择文件上传简历，是否继续？`,
      confirmText: '继续',
      success: (res) => {
        if (!res.confirm) return;

        wx.chooseMessageFile({
          count: 1,
          type: 'file',
          extension: ['pdf', 'doc', 'docx'],
          success: (chooseRes) => {
            const file = (chooseRes.tempFiles || [])[0];
            if (!file) {
              wx.showToast({
                title: '未选择文件',
                icon: 'none'
              });
              return;
            }

            this.setData({
              lastPickedFile: {
                name: file.name,
                size: file.size,
                path: file.path
              }
            });

            wx.showToast({
              title: '文件已选择',
              icon: 'success'
            });
          },
          fail: () => {
            wx.showToast({
              title: '已取消',
              icon: 'none'
            });
          }
        });
      }
    });
  },

  onUploadResume() {
    wx.showActionSheet({
      itemList: ['从手机文件选择', '从微信聊天记录选择'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.pickFileWithConfirm('手机文件');
        } else if (res.tapIndex === 1) {
          this.pickFileWithConfirm('微信聊天记录');
        }
      }
    });
  },

  onResumeTap(e) {
    if (this._suppressNextTap) {
      this._suppressNextTap = false;
      return;
    }

    const index = Number(e.currentTarget.dataset.index);
    const resumes = this.data.resumes || [];
    const safeResumes = this.ensureAtLeastOneResume(resumes);
    const target = safeResumes[index];

    if (!target) return;

    this.navigateToResumeEdit(index);
  },

  onResumeLongPress(e) {
    const index = Number(e.currentTarget.dataset.index);
    this._suppressNextTap = true;
    this.deleteResumeByIndex(index);
  },

  deleteResumeByIndex(index) {
    const resumes = this.ensureAtLeastOneResume(this.data.resumes || []);
    if (resumes.length <= 1) {
      wx.showToast({
        title: '至少保留一份简历',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，是否继续？',
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: (res) => {
        if (!res.confirm) return;
        const next = resumes.filter((_, i) => i !== index);
        const viewState = this.computeViewState(next);
        this.setData(viewState);
        this.saveResumes(viewState.resumes);
      }
    });
  },

  onDeleteResume(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.deleteResumeByIndex(index);
  },

  onAddResume() {
    const resumes = this.ensureAtLeastOneResume(this.data.resumes || []);
    const now = new Date();
    const nextName = this.getNextDefaultName(resumes);
    const next = resumes.concat([{
      id: `r_${Date.now()}`,
      name: nextName,
      updatedAt: this.formatDate(now),
      completion: 0
    }]);
    const viewState = this.computeViewState(next);
    this.setData(viewState);
    this.saveResumes(viewState.resumes);
    this.navigateToResumeMakeById(viewState.resumes[viewState.resumes.length - 1].id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadResumes();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadResumes();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})