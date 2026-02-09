// pages/resume/resume.js
const api = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 1, // 临时使用固定用户ID，后续需要从登录信息获取
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

  navigateToResumePreview(backendId) {
    if (!backendId) return;
    wx.navigateTo({
      url: `/pages/resume-preview/resume-preview?id=${backendId}`
    });
  },

  navigateToResumeMakeByIndex(index) {
    const resumes = this.data.resumes || [];
    const safeResumes = this.ensureAtLeastOneResume(resumes);
    const target = safeResumes[index];
    if (!target) return;
    this.navigateToResumeMakeById(target.id);
  },

  onPreviewResume(e) {
    const index = Number(e.currentTarget.dataset.index);
    const resumes = this.data.resumes || [];
    const safeResumes = this.ensureAtLeastOneResume(resumes);
    const target = safeResumes[index];

    if (!target || !target.backendId) {
      wx.showToast({
        title: '简历数据异常',
        icon: 'none'
      });
      return;
    }

    this.navigateToResumePreview(target.backendId);
  },

  saveResumes(resumes) {
    wx.setStorageSync(this.getResumeStorageKey(), resumes);
  },

  loadResumes() {
    // 从后端加载简历列表
    wx.showLoading({ title: '加载中...' });

    api.getResumeList(this.data.userId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          // 转换后端数据格式为前端格式
          const resumes = res.data.map(item => ({
            id: `r_${item.id}`,
            backendId: item.id, // 保存后端ID
            name: item.name || '我的简历',
            updatedAt: this.formatDate(new Date(item.updatedAt || item.createdAt)),
            completion: this.calculateCompletion(item)
          }));

          const viewState = this.computeViewState(resumes);
          this.setData(viewState);

          // 同时保存到本地存储作为备份
          this.saveResumes(viewState.resumes);
        } else {
          // 如果后端没有数据，使用本地存储
          this.loadResumesFromLocal();
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载简历失败:', err);
        // 失败时使用本地存储
        this.loadResumesFromLocal();
      });
  },

  loadResumesFromLocal() {
    const resumes = wx.getStorageSync(this.getResumeStorageKey());
    const viewState = this.computeViewState(resumes);
    this.setData(viewState);
    this.saveResumes(viewState.resumes);
  },

  calculateCompletion(resume) {
    // 简单计算完成度，后续可以优化
    let score = 0;
    if (resume.name) score += 20;
    if (resume.phone) score += 20;
    if (resume.email) score += 20;
    if (resume.education) score += 20;
    if (resume.school) score += 20;
    return score;
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

        const targetResume = resumes[index];
        const backendId = targetResume.backendId;

        // 如果有后端ID，调用后端删除接口
        if (backendId) {
          wx.showLoading({ title: '删除中...' });
          api.deleteResume(backendId)
            .then(() => {
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              // 删除成功后更新列表
              const next = resumes.filter((_, i) => i !== index);
              const viewState = this.computeViewState(next);
              this.setData(viewState);
              this.saveResumes(viewState.resumes);
            })
            .catch(err => {
              wx.hideLoading();
              console.error('删除失败:', err);
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            });
        } else {
          // 没有后端ID，只删除本地数据
          const next = resumes.filter((_, i) => i !== index);
          const viewState = this.computeViewState(next);
          this.setData(viewState);
          this.saveResumes(viewState.resumes);
        }
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

    // 创建新简历数据
    const newResumeData = {
      userId: this.data.userId,
      name: nextName
    };

    wx.showLoading({ title: '创建中...' });

    // 调用后端接口创建简历
    api.createResume(newResumeData)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          wx.showToast({
            title: '创建成功',
            icon: 'success'
          });

          // 添加到列表
          const newResume = {
            id: `r_${res.data.id}`,
            backendId: res.data.id,
            name: res.data.name,
            updatedAt: this.formatDate(now),
            completion: 0
          };

          const next = resumes.concat([newResume]);
          const viewState = this.computeViewState(next);
          this.setData(viewState);
          this.saveResumes(viewState.resumes);

          // 跳转到编辑页面
          this.navigateToResumeMakeById(newResume.id);
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('创建简历失败:', err);
        wx.showToast({
          title: '创建失败，请检查网络',
          icon: 'none'
        });

        // 失败时创建本地简历
        const localResume = {
          id: `r_${Date.now()}`,
          name: nextName,
          updatedAt: this.formatDate(now),
          completion: 0
        };
        const next = resumes.concat([localResume]);
        const viewState = this.computeViewState(next);
        this.setData(viewState);
        this.saveResumes(viewState.resumes);
        this.navigateToResumeMakeById(localResume.id);
      });
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
