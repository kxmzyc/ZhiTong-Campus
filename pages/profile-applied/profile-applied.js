const api = require('../../utils/api');

Page({
  data: {
    statusBarHeight: 0,
    userId: 1, // 临时使用固定用户ID
    applications: [],
    loading: false
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });
    this.loadApplications();
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '已投递'
    });
    this.loadApplications();
  },

  /**
   * 加载申请列表
   */
  loadApplications() {
    this.setData({ loading: true });

    api.getApplicationList(this.data.userId)
      .then(res => {
        this.setData({ loading: false });
        if (res.code === 200 && res.data) {
          // 处理数据
          const applications = res.data.map(item => ({
            id: item.id,
            jobId: item.jobId,
            jobTitle: item.jobTitle,
            salary: this.formatSalary(item.salaryMin, item.salaryMax),
            companyName: item.companyName,
            companyLogo: item.companyLogo,
            city: item.city,
            status: item.status,
            statusText: this.getStatusText(item.status),
            appliedAt: this.formatDate(item.appliedAt),
            companyId: item.companyId
          }));

          this.setData({ applications });
        }
      })
      .catch(err => {
        this.setData({ loading: false });
        console.error('加载申请列表失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  /**
   * 格式化薪资
   */
  formatSalary(min, max) {
    if (!min || !max) return '面议';
    return `${min}-${max}K`;
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'pending': '已投递',
      'viewed': '已查看',
      'interview': '面试中',
      'offer': '已录用',
      'rejected': '不合适'
    };
    return statusMap[status] || '已投递';
  },

  /**
   * 跳转到职位详情
   */
  goToJobDetail(e) {
    const jobId = e.currentTarget.dataset.jobid;
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?id=${jobId}`
    });
  },

  /**
   * 跳转到公司详情
   */
  goToCompanyDetail(e) {
    const companyId = e.currentTarget.dataset.companyid;
    wx.navigateTo({
      url: `/pages/company-detail/company-detail?id=${companyId}`
    });
  },

  /**
   * 撤销申请
   */
  onCancelApplication(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销该申请吗？',
      confirmText: '撤销',
      confirmColor: '#ef4444',
      success: (res) => {
        if (!res.confirm) return;

        wx.showLoading({ title: '撤销中...' });

        api.cancelApplication(id, this.data.userId)
          .then(res => {
            wx.hideLoading();
            if (res.code === 200) {
              wx.showToast({
                title: '撤销成功',
                icon: 'success'
              });
              // 重新加载列表
              this.loadApplications();
            }
          })
          .catch(err => {
            wx.hideLoading();
            console.error('撤销失败:', err);
            wx.showToast({
              title: '撤销失败',
              icon: 'none'
            });
          });
      }
    });
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
