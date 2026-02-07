Page({
  data: {
    statusBarHeight: 0,
    jobs: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loadingInit: true,
    loadingMore: false,
    selectedCount: 0,
    autoDeliveryEnabled: false,
    autoDeliveryOn: false,
    autoModalOpen: false,
    autoAgreeChecked: false
  },

  noop() {},

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });

    this.loadInitial();
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  loadInitial() {
    this.setData({
      jobs: [],
      page: 1,
      hasMore: true,
      loadingInit: true,
      loadingMore: false,
      selectedCount: 0
    });

    this.loadMoreInternal();
  },

  onLoadMore() {
    if (this.data.loadingMore || !this.data.hasMore) return;
    this.loadMoreInternal();
  },

  loadMoreInternal() {
    this.setData({
      loadingMore: true
    });

    const currentPage = this.data.page;
    const pageSize = this.data.pageSize;

    setTimeout(() => {
      const nextItems = this.mockFetchJobs(currentPage, pageSize);
      const maxPage = 5;
      const hasMore = currentPage < maxPage;

      const merged = [...this.data.jobs, ...nextItems];
      this.setData({
        jobs: merged,
        page: currentPage + 1,
        hasMore,
        loadingInit: false,
        loadingMore: false
      });
    }, 650);
  },

  mockFetchJobs(page, pageSize) {
    const titles = [
      '产品开发类(产品经理/Java开发工程师)',
      '商业分析',
      '前端开发工程师实习生',
      '数据分析实习生',
      '后端开发工程师',
      '运营管培生',
      '测试开发工程师',
      '算法工程师',
      'UI/UX设计师',
      '市场营销管培生'
    ];

    const companies = [
      { name: '广州集泰化工股份有限公司', abbr: 'JT', city: '广州' },
      { name: '中国司法大数据研究院有限公司', abbr: 'JD', city: '北京' },
      { name: '重庆太和空间智能有限公司', abbr: 'TH', city: '重庆' },
      { name: '深圳星云科技有限公司', abbr: 'XY', city: '深圳' },
      { name: '杭州云启信息技术有限公司', abbr: 'YQ', city: '杭州' }
    ];

    const requirements = [
      '本科及以上 · 计算机类/电子信息类',
      '硕士及以上 · 统计学类',
      '本科及以上 · 软件工程/计算机类',
      '本科及以上 · 数学/统计/计算机',
      '本科及以上 · 不限专业'
    ];

    const dates = ['01-04', '01-29', '02-02', '02-08', '02-15'];

    const list = [];
    for (let i = 0; i < pageSize; i += 1) {
      const idx = (page - 1) * pageSize + i;
      const t = titles[idx % titles.length];
      const c = companies[idx % companies.length];
      const r = requirements[idx % requirements.length];
      const d = dates[idx % dates.length];
      list.push({
        id: page * 1000 + i,
        title: t,
        company: c.name,
        companyAbbr: c.abbr,
        requirement: r,
        city: c.city,
        dateText: d,
        tags: [r.split('·')[0].trim(), r.split('·')[1] ? r.split('·')[1].trim() : '不限'],
        selected: false
      });
    }
    return list;
  },

  onToggleJob(e) {
    const id = Number(e.currentTarget.dataset.id);
    if (!Number.isFinite(id)) return;

    const next = this.data.jobs.map((j) => {
      if (j.id !== id) return j;
      return {
        ...j,
        selected: !j.selected
      };
    });

    const selectedCount = next.reduce((acc, j) => acc + (j.selected ? 1 : 0), 0);

    this.setData({
      jobs: next,
      selectedCount
    });
  },

  onAutoToggle() {
    if (this.data.autoDeliveryOn) {
      this.setData({
        autoDeliveryOn: false
      });
      return;
    }

    if (this.data.autoDeliveryEnabled) {
      this.setData({
        autoDeliveryOn: true
      });
      return;
    }

    this.setData({
      autoModalOpen: true,
      autoAgreeChecked: false
    });
  },

  closeAutoModal() {
    this.setData({
      autoModalOpen: false,
      autoAgreeChecked: false
    });
  },

  toggleAutoAgree() {
    this.setData({
      autoAgreeChecked: !this.data.autoAgreeChecked
    });
  },

  confirmAutoEnable() {
    if (!this.data.autoAgreeChecked) {
      wx.showToast({
        title: '请先勾选授权',
        icon: 'none'
      });
      return;
    }

    this.setData({
      autoDeliveryEnabled: true,
      autoDeliveryOn: true,
      autoModalOpen: false,
      autoAgreeChecked: false
    });

    wx.showToast({
      title: '已开启AI自动投',
      icon: 'success',
      duration: 600
    });
  },

  onOneClickDeliver() {
    const count = this.data.selectedCount;
    if (!count) {
      wx.showToast({
        title: '请先选择岗位！',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: `投递成功！`,
      icon: 'success'
    });

    setTimeout(() => {
      this.loadInitial();
    }, 600);
  },

  onRefresh() {
    this.loadInitial();
  },

  onChangePlan() {
    wx.showToast({
      title: '变更方案功能开发中',
      icon: 'none'
    });
  }
});
