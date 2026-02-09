// pages/campus/campus.js
const api = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeSubTab: 0,
    subTabs: ['热招岗位', '校招简章', '网申简章'],
    jobCountSuffix: '个热招岗位',
    selectedIndustries: [],
    selectedPositions: [],
    selectedCities: [],
    cityFilterLabel: '',
    filterActiveIndustry: false,
    filterActivePosition: false,
    filterActiveCity: false,
    searchQuery: '',
    filterOptions: {
      industry: ['全部', '互联网', '电商', '云计算', '通信', '硬件', '游戏', '音乐', '出行'],
      position: ['全部', '技术', '产品', '运营', '设计'],
      city: ['全部', '北京', '上海', '深圳', '杭州']
    },
    companiesByTab: {
      0: [
        {
          id: 101,
          name: '阿里巴巴',
          logo: '/images/company1.jpg',
          tags: ['互联网', '电商', '云计算'],
          industry: '互联网',
          position: '技术',
          city: '杭州',
          description: '热招岗位：前端/后端/算法/产品等多个方向开放。',
          jobCount: 156
        },
        {
          id: 102,
          name: '腾讯',
          logo: '/images/company2.jpg',
          tags: ['互联网', '游戏', '社交'],
          industry: '互联网',
          position: '技术',
          city: '深圳',
          description: '热招岗位：校招提前批进行中，建议尽早投递核心岗位。',
          jobCount: 234
        },
        {
          id: 103,
          name: '字节跳动',
          logo: '/images/company3.jpg',
          tags: ['互联网', '短视频', 'AI'],
          industry: '互联网',
          position: '产品',
          city: '北京',
          description: '热招岗位：技术岗持续更新，支持多城市投递。',
          jobCount: 189
        },
        {
          id: 104,
          name: '华为',
          logo: '/images/company4.jpg',
          tags: ['通信', '硬件', '5G'],
          industry: '通信',
          position: '技术',
          city: '深圳',
          description: '热招岗位：研发/测试/产品等方向，覆盖北京/上海/深圳。',
          jobCount: 267
        }
      ],
      1: [
        {
          id: 201,
          name: '网易',
          logo: '/images/company8.jpg',
          tags: ['互联网', '游戏', '音乐'],
          industry: '互联网',
          position: '运营',
          city: '杭州',
          description: '校招简章：宣讲会/双选会信息已发布，欢迎投递应届岗位。',
          jobCount: 98
        },
        {
          id: 202,
          name: '小米',
          logo: '/images/company9.jpg',
          tags: ['硬件', '手机', 'IoT'],
          industry: '硬件',
          position: '产品',
          city: '北京',
          description: '校招简章：技术/产品/设计岗位开放，笔试与面试安排已公布。',
          jobCount: 167
        },
        {
          id: 203,
          name: '滴滴',
          logo: '/images/company10.jpg',
          tags: ['互联网', '出行', '共享经济'],
          industry: '出行',
          position: '技术',
          city: '北京',
          description: '校招简章：招聘流程、岗位说明、面试节奏与城市站点安排。',
          jobCount: 89
        }
      ],
      2: [
        {
          id: 301,
          name: '美团',
          logo: '/images/company5.jpg',
          tags: ['网申', '流程'],
          industry: '互联网',
          position: '运营',
          city: '北京',
          description: '网申流程、测评说明、面试节奏（示例数据）。',
          jobCount: 5
        },
        {
          id: 302,
          name: '京东',
          logo: '/images/company6.jpg',
          tags: ['网申', '笔试'],
          industry: '电商',
          position: '技术',
          city: '北京',
          description: '笔试题型、投递策略与注意事项（示例数据）。',
          jobCount: 4
        },
        {
          id: 303,
          name: '百度',
          logo: '/images/company7.jpg',
          tags: ['网申', '面试'],
          industry: '互联网',
          position: '技术',
          city: '北京',
          description: '技术岗面试流程、准备建议（示例数据）。',
          jobCount: 7
        }
      ]
    },
    companies: []
  },

  goToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  goToResume() {
    wx.reLaunch({
      url: '/pages/resume/resume'
    });
  },

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile?from=campus'
    });
  },

  goToAiSelect() {
    wx.navigateTo({
      url: '/pages/ai-select-delivery/ai-select-delivery'
    });
  },

  goToAiAuto() {
    wx.showToast({
      title: 'AI自动投递功能开发中',
      icon: 'none'
    });
  },

  goToCompanyDetail(e) {
    const companyId = e.currentTarget.dataset.id;
    wx.showToast({
      title: `公司ID: ${companyId}`,
      icon: 'none'
    });
  },

  onSubTabChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index) || index === this.data.activeSubTab) return;

    const suffixMap = {
      0: '个热招岗位',
      1: '条校招简章',
      2: '条网申简章'
    };

    this.setData(
      {
        activeSubTab: index,
        jobCountSuffix: suffixMap[index] || ''
      },
      () => {
        this.refreshCompanies();
      }
    );
  },

  onCityFilterTap() {
    wx.navigateTo({
      url: '/pages/city-select/city-select'
    });
  },

  onIndustryFilterTap() {
    wx.navigateTo({
      url: '/pages/industry-select/industry-select'
    });
  },

  onPositionFilterTap() {
    wx.navigateTo({
      url: '/pages/position-select/position-select'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.syncSelectedCities();
    this.syncSelectedIndustries();
    this.syncSelectedPositions();
    this.loadJobsFromBackend();
  },

  onShow() {
    this.syncSelectedCities();
    this.syncSelectedIndustries();
    this.syncSelectedPositions();
    this.loadJobsFromBackend();
  },

  /**
   * 从后端加载职位数据
   */
  loadJobsFromBackend() {
    wx.showLoading({ title: '加载中...' });

    api.getJobList()
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          // 将后端职位数据转换为前端格式
          const jobs = res.data.map(job => ({
            id: job.id,
            name: job.company,
            logo: '/images/company1.jpg', // 默认logo
            tags: [job.industry, job.jobType, job.city].filter(Boolean),
            industry: job.industry,
            position: job.title,
            city: job.city,
            description: `${job.title} | ${job.salaryRange} | ${job.educationRequired}`,
            jobCount: 1,
            jobData: job // 保存完整的职位数据
          }));

          // 按公司分组
          const companiesByTab = {
            0: jobs, // 热招岗位
            1: [], // 校招简章（暂时为空）
            2: []  // 网申简章（暂时为空）
          };

          this.setData({
            companiesByTab: companiesByTab
          }, () => {
            this.refreshCompanies();
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载职位失败:', err);
        wx.showToast({
          title: '加载失败，请检查后端服务',
          icon: 'none',
          duration: 2000
        });
        // 失败时使用原有的模拟数据
        this.refreshCompanies();
      });
  },

  updateFilterActiveStates(extra = {}) {
    const selectedIndustries = Object.prototype.hasOwnProperty.call(extra, 'selectedIndustries')
      ? extra.selectedIndustries
      : this.data.selectedIndustries;
    const selectedPositions = Object.prototype.hasOwnProperty.call(extra, 'selectedPositions')
      ? extra.selectedPositions
      : this.data.selectedPositions;
    const selectedCities = Object.prototype.hasOwnProperty.call(extra, 'selectedCities')
      ? extra.selectedCities
      : this.data.selectedCities;

    this.setData({
      filterActiveIndustry: Array.isArray(selectedIndustries) && selectedIndustries.length > 0,
      filterActivePosition: Array.isArray(selectedPositions) && selectedPositions.length > 0,
      filterActiveCity: Array.isArray(selectedCities) && selectedCities.length > 0
    });
  },

  syncSelectedCities() {
    const selectedCities = wx.getStorageSync('campus_selected_cities') || [];
    const label = this.getCityFilterLabel(selectedCities);
    this.setData(
      {
        selectedCities,
        cityFilterLabel: label,
        filterActiveCity: Array.isArray(selectedCities) && selectedCities.length > 0
      }
    );
  },

  syncSelectedIndustries() {
    const selectedIndustries = wx.getStorageSync('campus_selected_industries') || [];
    this.setData({
      selectedIndustries: Array.isArray(selectedIndustries) ? selectedIndustries : [],
      filterActiveIndustry: Array.isArray(selectedIndustries) && selectedIndustries.length > 0
    });
  },

  syncSelectedPositions() {
    const selectedPositions = wx.getStorageSync('campus_selected_positions') || [];
    this.setData({
      selectedPositions: Array.isArray(selectedPositions) ? selectedPositions : [],
      filterActivePosition: Array.isArray(selectedPositions) && selectedPositions.length > 0
    });
  },

  getCityFilterLabel(selectedCities) {
    const list = Array.isArray(selectedCities) ? selectedCities : [];
    if (!list.length) return '';
    const first = this.normalizeCity(list[0]);
    if (list.length === 1) return first;
    return `${first}+${list.length - 1}`;
  },

  onFilterTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'city') return this.onCityFilterTap();
    if (type === 'industry') return this.onIndustryFilterTap();
    if (type === 'position') return this.onPositionFilterTap();
  },

  onSearchInput(e) {
    const value = (e.detail && e.detail.value) || '';
    this.setData({ searchQuery: value }, () => this.refreshCompanies());
  },

  onSearchConfirm(e) {
    const value = (e.detail && e.detail.value) || this.data.searchQuery || '';
    this.setData({ searchQuery: value }, () => this.refreshCompanies());
  },

  onSearchTap() {
    this.refreshCompanies();
  },

  normalizeCity(name) {
    const s = (name || '').trim();
    if (!s) return '';
    if (s.endsWith('市') && s.length > 1) return s.slice(0, -1);
    return s;
  },

  refreshCompanies() {
    const active = this.data.activeSubTab;
    const companiesByTab = this.data.companiesByTab || {};
    const source = companiesByTab[active] || [];

    const rawQuery = (this.data.searchQuery || '').trim();
    if (rawQuery) {
      const q = rawQuery.toLowerCase();
      const list = source.filter((c) => {
        const name = (c.name || '').toLowerCase();
        const desc = (c.description || '').toLowerCase();
        const tags = Array.isArray(c.tags) ? c.tags.join(' ') : '';
        return name.includes(q) || desc.includes(q) || tags.toLowerCase().includes(q);
      });
      this.setData({ companies: list });
      return;
    }

    const { selectedIndustries, selectedPositions, selectedCities } = this.data;
    const citySet = new Set(
      (Array.isArray(selectedCities) ? selectedCities : [])
        .map((c) => this.normalizeCity(c))
        .filter(Boolean)
    );

    const industryKeywords = (Array.isArray(selectedIndustries) ? selectedIndustries : []).filter(Boolean);
    const positionKeywords = (Array.isArray(selectedPositions) ? selectedPositions : []).filter(Boolean);

    const matchByKeywords = (c, keywords) => {
      if (!keywords.length) return true;
      const haystack = [
        c.name,
        c.description,
        c.industry,
        c.position,
        c.city,
        Array.isArray(c.tags) ? c.tags.join(' ') : ''
      ]
        .filter(Boolean)
        .join(' ');
      return keywords.some((k) => haystack.includes(k));
    };

    const list = source.filter((c) => {
      if (!matchByKeywords(c, industryKeywords)) return false;
      if (!matchByKeywords(c, positionKeywords)) return false;
      if (citySet.size && !citySet.has(this.normalizeCity(c.city))) return false;
      return true;
    });

    this.setData({ companies: list });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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