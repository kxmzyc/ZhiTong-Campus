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
    canCreateMore: true, // 默认允许创建
    lastPickedFile: null,
    loading: false,
    isEmpty: false // 是否为空列表
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

  navigateToResumeMakeById(backendId) {
    if (!backendId) {
      wx.showToast({
        title: '简历ID无效',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/resume-make/resume-make?id=${backendId}`
    });
  },

  navigateToResumePreview(backendId) {
    if (!backendId) {
      wx.showToast({
        title: '简历ID无效',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/resume-preview/resume-preview?id=${backendId}`
    });
  },

  navigateToResumeMakeByIndex(index) {
    const resumes = this.data.resumes || [];
    const target = resumes[index];
    if (!target || !target.backendId) {
      wx.showToast({
        title: '简历数据异常',
        icon: 'none'
      });
      return;
    }
    this.navigateToResumeMakeById(target.backendId);
  },

  onPreviewResume(e) {
    const index = Number(e.currentTarget.dataset.index);
    const resumes = this.data.resumes || [];
    const target = resumes[index];

    if (!target || !target.backendId) {
      wx.showToast({
        title: '简历数据异常',
        icon: 'none'
      });
      return;
    }

    this.navigateToResumePreview(target.backendId);
  },

  loadResumes() {
    // 从后端加载简历列表（后端主导模式）
    if (this.data.loading) return;

    this.setData({ loading: true });
    wx.showLoading({ title: '加载中...' });

    api.getResumeList(this.data.userId)
      .then(res => {
        wx.hideLoading();
        this.setData({ loading: false });

        if (res.code === 200) {
          const backendResumes = res.data || [];

          // 转换后端数据格式为前端格式
          const resumes = backendResumes.map(item => ({
            backendId: item.id, // 后端真实ID（必须）
            name: item.name || '我的简历',
            updatedAt: this.formatDate(new Date(item.updatedAt || item.createdAt)),
            completion: this.calculateCompletion(item)
          }));

          this.setData({
            resumes: resumes,
            displayResumes: resumes,
            isEmpty: resumes.length === 0,
            canCreateMore: true // 始终允许创建
          });
        } else {
          wx.showToast({
            title: res.message || '加载失败',
            icon: 'none'
          });
          this.setData({
            resumes: [],
            displayResumes: [],
            isEmpty: true
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        this.setData({ loading: false });
        console.error('加载简历失败:', err);
        wx.showToast({
          title: '加载失败，请检查网络',
          icon: 'none'
        });
        this.setData({
          resumes: [],
          displayResumes: [],
          isEmpty: true
        });
      });
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
    // 如果有简历，编辑第一份；否则创建新简历
    const resumes = this.data.resumes || [];
    if (resumes.length > 0) {
      this.navigateToResumeMakeByIndex(0);
    } else {
      this.onAddResume();
    }
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
    const target = resumes[index];

    if (!target || !target.backendId) {
      wx.showToast({
        title: '简历数据异常',
        icon: 'none'
      });
      return;
    }

    this.navigateToResumeMakeByIndex(index);
  },

  onResumeLongPress(e) {
    const index = Number(e.currentTarget.dataset.index);
    this._suppressNextTap = true;
    this.deleteResumeByIndex(index);
  },

  deleteResumeByIndex(index) {
    const resumes = this.data.resumes || [];
    const targetResume = resumes[index];

    if (!targetResume) {
      wx.showToast({
        title: '简历不存在',
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

        const backendId = targetResume.backendId;

        // 必须有后端ID才能删除
        if (!backendId) {
          wx.showToast({
            title: '数据异常，无法删除',
            icon: 'none'
          });
          return;
        }

        wx.showLoading({ title: '删除中...' });
        api.deleteResume(backendId)
          .then((deleteRes) => {
            wx.hideLoading();
            if (deleteRes.code === 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              // 重新加载列表
              this.loadResumes();
            } else {
              wx.showToast({
                title: deleteRes.message || '删除失败',
                icon: 'none'
              });
            }
          })
          .catch(err => {
            wx.hideLoading();
            console.error('删除失败:', err);
            wx.showToast({
              title: '删除失败，请检查网络',
              icon: 'none'
            });
          });
      }
    });
  },

  onDeleteResume(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.deleteResumeByIndex(index);
  },

  onAddResume() {
    const resumes = this.data.resumes || [];
    const nextName = this.getNextDefaultName(resumes);

    // 创建新简历数据
    const newResumeData = {
      userId: this.data.userId,
      name: nextName
    };

    wx.showLoading({ title: '创建中...' });

    // 调用后端接口创建简历（必须成功）
    api.createResume(newResumeData)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data && res.data.id) {
          wx.showToast({
            title: '创建成功',
            icon: 'success'
          });

          // 跳转到编辑页面（使用后端返回的真实ID）
          setTimeout(() => {
            this.navigateToResumeMakeById(res.data.id);
          }, 500);
        } else {
          wx.showToast({
            title: res.message || '创建失败',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('创建简历失败:', err);
        wx.showToast({
          title: '创建失败，请检查网络',
          icon: 'none'
        });
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
