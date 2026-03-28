// pages/job-detail/job-detail.js
const api = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobId: null,
    userId: 1, // 测试用户ID（写死）
    resumeId: 1, // 测试简历ID（写死）
    isApplied: false, // 是否已投递
    applyBtnText: '投递简历', // 按钮文字
    applyBtnDisabled: false, // 按钮是否禁用
    job: {
      id: null,
      title: '',
      salary: '',
      education: '',
      experience: '',
      city: '',
      tags: [],
      description: ''
    },
    company: {
      id: null,
      name: '',
      logo: '',
      industry: '',
      scale: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('=== job-detail onLoad ===');
    console.log('接收到的参数:', options);

    const jobId = options.id ? parseInt(options.id) : null;
    console.log('职位ID:', jobId);

    if (jobId) {
      this.setData({ jobId });
      this.loadJobDetail(jobId);
      // 检查是否已投递
      this.checkApplicationStatus(jobId);
    } else {
      wx.showToast({
        title: '职位ID无效',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载职位详情
   */
  loadJobDetail(jobId) {
    wx.showLoading({ title: '加载中...' });

    api.getJobDetail(jobId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          const jobData = res.data;
          console.log('✅ 成功加载职位数据:', jobData);

          // 处理职位数据
          const job = {
            id: jobData.id,
            title: jobData.title,
            salary: `${jobData.salaryMin}-${jobData.salaryMax}K`,
            education: jobData.education,
            experience: jobData.experience,
            city: jobData.city,
            tags: JSON.parse(jobData.tags || '[]'),
            description: jobData.description || '暂无职位描述'
          };

          this.setData({ job });

          // 如果有公司ID，加载公司信息
          if (jobData.companyId) {
            this.loadCompanyInfo(jobData.companyId);
          }
        } else {
          throw new Error('职位数据格式错误');
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('❌ 加载职位详情失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      });
  },

  /**
   * 加载公司信息
   */
  loadCompanyInfo(companyId) {
    api.getCompanyDetail(companyId)
      .then(res => {
        if (res.code === 200 && res.data) {
          const companyData = res.data;
          console.log('✅ 成功加载公司数据:', companyData.name);

          const company = {
            id: companyData.id,
            name: companyData.name,
            logo: companyData.logo,
            industry: companyData.industry,
            scale: companyData.scale
          };

          this.setData({ company });
        }
      })
      .catch(err => {
        console.error('❌ 加载公司信息失败:', err);
        // 公司信息加载失败不影响职位详情展示
      });
  },

  /**
   * 检查投递状态
   */
  checkApplicationStatus(jobId) {
    const userId = this.data.userId;
    console.log('检查投递状态，userId:', userId, 'jobId:', jobId);

    api.checkApplied(userId, jobId)
      .then(res => {
        if (res.code === 200) {
          const isApplied = res.data === true || res.data === 'true';
          console.log('投递状态:', isApplied);

          this.setData({
            isApplied: isApplied,
            applyBtnText: isApplied ? '已投递' : '投递简历',
            applyBtnDisabled: isApplied
          });
        }
      })
      .catch(err => {
        console.error('❌ 检查投递状态失败:', err);
        // 检查失败不影响页面展示，默认为未投递
      });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 跳转到公司详情
   */
  goToCompanyDetail() {
    if (this.data.company.id) {
      wx.navigateTo({
        url: `/pages/company-detail/company-detail?id=${this.data.company.id}`
      });
    }
  },

  /**
   * 立即沟通
   */
  onChat() {
    wx.showToast({
      title: '沟通功能开发中',
      icon: 'none'
    });
  },

  /**
   * 投递简历
   */
  onApply() {
    // 如果已投递，不允许重复投递
    if (this.data.isApplied) {
      wx.showToast({
        title: '您已投递过该职位',
        icon: 'none'
      });
      return;
    }

    const userId = this.data.userId;
    const jobId = this.data.jobId;
    const resumeId = this.data.resumeId;

    console.log('开始投递简历，userId:', userId, 'jobId:', jobId, 'resumeId:', resumeId);

    wx.showLoading({ title: '投递中...' });

    api.applyJob(userId, jobId, resumeId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200) {
          console.log('✅ 投递成功');

          // 更新投递状态
          this.setData({
            isApplied: true,
            applyBtnText: '已投递',
            applyBtnDisabled: true
          });

          wx.showToast({
            title: '投递成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          throw new Error(res.message || '投递失败');
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('❌ 投递失败:', err);

        const errorMsg = err.message || err.errMsg || '投递失败，请稍后重试';
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
      });
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
    return {
      title: `${this.data.job.title} - 职通校园`,
      path: `/pages/job-detail/job-detail?id=${this.data.jobId}`
    };
  }
})
