// pages/campus/campus.js
const api = require('../../utils/api');

/**
 * 静态数据源 - 四大互联网公司
 * 注意：字段名必须与 wxml 中的绑定保持一致
 */
const MOCK_COMPANIES = [
  {
    id: 101,
    name: '阿里巴巴',
    logo: 'https://ui-avatars.com/api/?name=Alibaba&background=FF6A00&color=fff&size=200&bold=true',
    tags: ['互联网', '电商', '云计算'],
    industry: '互联网',
    position: '技术',
    city: '杭州',
    description: '热招岗位：Java/前端/算法/云计算等多个方向开放，欢迎投递。',
    jobCount: 1200
  },
  {
    id: 102,
    name: '腾讯',
    logo: 'https://ui-avatars.com/api/?name=Tencent&background=00A4FF&color=fff&size=200&bold=true',
    tags: ['互联网', '游戏', '社交'],
    industry: '互联网',
    position: '技术',
    city: '深圳',
    description: '热招岗位：微信/游戏/腾讯云等核心业务持续招聘中。',
    jobCount: 800
  },
  {
    id: 103,
    name: '字节跳动',
    logo: 'https://ui-avatars.com/api/?name=ByteDance&background=0052D9&color=fff&size=200&bold=true',
    tags: ['互联网', '短视频', 'AI'],
    industry: '互联网',
    position: '技术',
    city: '北京',
    description: '热招岗位：抖音/今日头条/飞书等产品线技术岗位开放。',
    jobCount: 1000
  },
  {
    id: 201,
    name: '网易',
    logo: 'https://ui-avatars.com/api/?name=NetEase&background=D32F2F&color=fff&size=200&bold=true',
    tags: ['互联网', '游戏', '音乐'],
    industry: '互联网',
    position: '技术',
    city: '杭州',
    description: '热招岗位：游戏/云音乐/有道等业务线持续招聘中。',
    jobCount: 600
  }
];

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
    // 保留原有的 companiesByTab 结构，但不再使用
    companiesByTab: {
      0: [],
      1: [],
      2: []
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

  /**
   * 跳转到公司详情页
   * 注意：确保能正确获取 dataset.id 并跳转
   */
  goToCompanyDetail(e) {
    const companyId = e.currentTarget.dataset.id;
    console.log('点击公司卡片，ID:', companyId);
    wx.navigateTo({
      url: `/pages/company-detail/company-detail?id=${companyId}`
    });
  },

  /**
   * 切换子标签页
   * 注意：所有标签页都显示相同的4家公司
   */
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
        // 所有标签页都显示相同的4家公司
        this.loadMockCompanies();
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
    console.log('=== campus onLoad ===');
    this.syncSelectedCities();
    this.syncSelectedIndustries();
    this.syncSelectedPositions();

    // 【步骤2】暂时注释掉后端加载，使用 Mock 数据
    // this.loadJobsFromBackend();

    // 直接加载 Mock 数据
    this.loadMockCompanies();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('=== campus onShow ===');
    this.syncSelectedCities();
    this.syncSelectedIndustries();
    this.syncSelectedPositions();

    // 【步骤2】暂时注释掉后端加载，使用 Mock 数据
    // this.loadJobsFromBackend();

    // 直接加载 Mock 数据
    this.loadMockCompanies();
  },

  /**
   * 加载 Mock 公司数据
   * 【步骤1 & 步骤2】使用静态数据源，确保用户看到4家指定公司
   */
  loadMockCompanies() {
    console.log('加载 Mock 公司数据，共', MOCK_COMPANIES.length, '家');

    // 直接设置为静态数据
    this.setData({
      companies: MOCK_COMPANIES
    });

    console.log('Mock 数据加载完成');
  },

  /**
   * 从后端加载职位数据（已暂时禁用）
   * 【步骤2】注释说明：暂时不使用后端数据，避免覆盖 Mock 数据
   */
  loadJobsFromBackend() {
    console.warn('loadJobsFromBackend 已暂时禁用，当前使用 Mock 数据');

    // 如果需要恢复后端加载，取消下面的注释
    /*
    // 构建查询参数
    const params = {};

    // 关键词搜索
    const keyword = (this.data.searchQuery || '').trim();
    if (keyword) {
      params.keyword = keyword;
    }

    // 城市筛选（取第一个选中的城市）
    const selectedCities = this.data.selectedCities || [];
    if (selectedCities.length > 0) {
      const city = selectedCities[0];
      // 过滤掉"全部"、"全国"等特殊值
      if (city && city !== '全部' && city !== '全国' && city !== '不限') {
        params.city = city;
      }
    }

    // 行业筛选（取第一个选中的行业）
    const selectedIndustries = this.data.selectedIndustries || [];
    if (selectedIndustries.length > 0) {
      const industry = selectedIndustries[0];
      // 过滤掉"全部"、"不限"等特殊值
      if (industry && industry !== '全部' && industry !== '不限') {
        params.industry = industry;
      }
    }

    // 职位类型筛选（取第一个选中的职位类型）
    const selectedPositions = this.data.selectedPositions || [];
    if (selectedPositions.length > 0) {
      const jobType = selectedPositions[0];
      // 过滤掉"全部"等特殊值
      if (jobType && jobType !== '全部' && jobType !== '不限') {
        params.jobType = jobType;
      }
    }

    wx.showLoading({ title: '加载中...' });

    api.getJobList(params)
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
            description: `${job.title} | ${job.salaryRange || '面议'} | ${job.educationRequired || ''}`,
            jobCount: 1,
            jobData: job // 保存完整的职位数据
          }));

          // 直接设置为当前显示的列表
          this.setData({
            companies: jobs
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载职位失败:', err);
        wx.showToast({
          title: '加载失败，请检查网络',
          icon: 'none',
          duration: 2000
        });
      });
    */
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
    this.setData({ searchQuery: value });
  },

  onSearchConfirm(e) {
    const value = (e.detail && e.detail.value) || this.data.searchQuery || '';
    this.setData({ searchQuery: value }, () => {
      // 【注意】搜索功能暂时不触发后端查询，保持显示 Mock 数据
      console.log('搜索关键词:', value);
      // this.loadJobsFromBackend();

      // 可以在这里实现前端搜索过滤
      this.filterMockCompanies(value);
    });
  },

  onSearchTap() {
    // 【注意】搜索功能暂时不触发后端查询，保持显示 Mock 数据
    console.log('点击搜索按钮');
    // this.loadJobsFromBackend();

    // 可以在这里实现前端搜索过滤
    this.filterMockCompanies(this.data.searchQuery);
  },

  /**
   * 前端搜索过滤（可选功能）
   * 根据关键词过滤 Mock 公司数据
   */
  filterMockCompanies(keyword) {
    if (!keyword || keyword.trim() === '') {
      // 如果没有关键词，显示所有公司
      this.setData({ companies: MOCK_COMPANIES });
      return;
    }

    const lowerKeyword = keyword.toLowerCase().trim();
    const filtered = MOCK_COMPANIES.filter(company => {
      return company.name.toLowerCase().includes(lowerKeyword) ||
             company.description.toLowerCase().includes(lowerKeyword) ||
             company.tags.some(tag => tag.toLowerCase().includes(lowerKeyword));
    });

    console.log('搜索结果:', filtered.length, '家公司');
    this.setData({ companies: filtered });
  },

  normalizeCity(name) {
    const s = (name || '').trim();
    if (!s) return '';
    if (s.endsWith('市') && s.length > 1) return s.slice(0, -1);
    return s;
  },

  // ========== 以下方法已废弃，改为后端动态查询 ==========

  /**
   * @deprecated 已改为后端动态查询，不再需要前端筛选
   */
  refreshCompanies() {
    // 此方法已废弃，保留用于兼容性
    // 现在所有筛选都通过 loadJobsFromBackend() 实现
    console.warn('refreshCompanies 方法已废弃，请使用 loadJobsFromBackend');
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
