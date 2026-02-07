Page({
  data: {
    statusBarHeight: 0,
    categoryTabs: [],
    activeCategoryKey: '互联网',
    query: '',
    isSearching: false,
    displayItems: [],
    selectedItems: [],
    selectedMap: {}
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const categoryTabs = this.getCategoryTabs();
    const selectedItems = wx.getStorageSync('campus_selected_industries') || [];
    const selectedMap = {};
    selectedItems.forEach((c) => {
      selectedMap[c] = true;
    });

    const firstKey = categoryTabs.length ? categoryTabs[0].key : '互联网';

    this.setData(
      {
        statusBarHeight: sys.statusBarHeight || 0,
        categoryTabs,
        activeCategoryKey: firstKey,
        selectedItems,
        selectedMap
      },
      () => {
        this.refreshDisplayItems();
      }
    );
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '行业'
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onConfirm() {
    const selectedItems = Array.isArray(this.data.selectedItems) ? this.data.selectedItems : [];
    wx.setStorageSync('campus_selected_industries', selectedItems);
    wx.showToast({
      title: '已保存',
      icon: 'success',
      duration: 400
    });

    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          wx.reLaunch({
            url: '/pages/campus/campus',
            fail: () => {
              wx.showToast({
                title: '返回失败',
                icon: 'none'
              });
            }
          });
        }
      });
    }, 150);
  },

  getCategoryTabs() {
    return [
      { key: '互联网', name: '1. 互联网' },
      { key: '金融', name: '2. 金融' },
      { key: '建筑工程', name: '3. 建筑工程' },
      { key: '制造', name: '4. 制造' },
      { key: '消费/物流', name: '5. 消费/物流' },
      { key: '医疗健康', name: '6. 医疗健康' },
      { key: '教育', name: '7. 教育' },
      { key: '传媒', name: '8. 传媒' },
      { key: '专业服务', name: '9. 专业服务' },
      { key: '能源环保/公用事业', name: '10. 能源环保/公用事业' },
      { key: '酒店/旅游/餐饮/生活服务', name: '11. 酒店/旅游/餐饮/生活服务' },
      { key: '政府/非营利组织/其他', name: '12. 政府/非营利组织/其他' }
    ];
  },

  getItemsByCategoryKey(key) {
    const map = {
      '互联网': ['移动互联网', '计算机软件', 'IT服务', '半导体', '通信/网络设备', '人工智能/大数据'],
      '金融': ['银行/证券/基金', '保险', '互联网金融/金融科技', '投资/资管', '会计/审计/税务'],
      '建筑工程': ['房地产开发', '建筑设计/规划', '工程施工', '装饰装修/建材', '工程咨询/监理'],
      '制造': ['车辆制造/配件', '机械/设备/重工', '电子/电器/半导体', '饮食/烟草', '医疗器械', '化工/能源/材料', '纺织/服装', '印刷/造纸'],
      '消费/物流': ['零售/批发/电商', '进出口贸易', '物流/仓储', '供应链/采购'],
      '医疗健康': ['医院/医疗机构', '生物医药/制药', '健康管理'],
      '教育': ['高等教育/职业院校', 'K12教育/基础教育', '职业培训/技能培训'],
      '传媒': ['广告/公关', '传媒/出版', '动漫/游戏', '电竞/体育', '新媒体/内容创作'],
      '专业服务': ['管理咨询/战略咨询', '人力资源服务', '法律/知识产权', '市场调研/数据分析'],
      '能源环保/公用事业': ['电力/水利/热力', '石油/石化/化工', '新能源/清洁能源', '环保/节能/资源回收'],
      '酒店/旅游/餐饮/生活服务': ['酒店/民宿/旅游', '餐饮/食品服务', '美容/美发/健身', '家政/物业/生活服务'],
      '政府/非营利组织/其他': ['政府/公共事业', '非营利组织/NGO', '军队/国防相关']
    };

    return map[key] || [];
  },

  refreshDisplayItems() {
    const query = (this.data.query || '').trim();
    const activeKey = this.data.activeCategoryKey;

    let list = [];
    if (query) {
      const q = query.toLowerCase();
      const allKeys = this.data.categoryTabs.map((t) => t.key);
      const allItems = [];
      allKeys.forEach((k) => {
        const items = this.getItemsByCategoryKey(k);
        items.forEach((it) => {
          allItems.push(it);
        });
      });
      const unique = Array.from(new Set(allItems));
      list = unique.filter((it) => String(it).toLowerCase().includes(q));
    } else {
      list = this.getItemsByCategoryKey(activeKey);
    }

    const displayItems = list.map((name) => ({ name }));
    this.setData({
      displayItems,
      isSearching: !!query
    });
  },

  onCategoryTap(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeCategoryKey) return;

    this.setData(
      {
        activeCategoryKey: key,
        query: ''
      },
      () => {
        this.refreshDisplayItems();
      }
    );
  },

  onQueryInput(e) {
    const value = (e.detail && e.detail.value) || '';
    this.setData(
      {
        query: value
      },
      () => {
        this.refreshDisplayItems();
      }
    );
  },

  onItemToggle(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const selectedMap = { ...(this.data.selectedMap || {}) };
    const selectedItems = [...(this.data.selectedItems || [])];

    if (selectedMap[name]) {
      delete selectedMap[name];
      const idx = selectedItems.indexOf(name);
      if (idx >= 0) selectedItems.splice(idx, 1);
    } else {
      if (selectedItems.length >= 3) {
        wx.showToast({
          title: '最多选择3个行业',
          icon: 'none'
        });
        return;
      }
      selectedMap[name] = true;
      selectedItems.push(name);
    }

    this.setData({
      selectedMap,
      selectedItems
    });
  },

  onRemoveSelected(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const selectedMap = { ...(this.data.selectedMap || {}) };
    const selectedItems = [...(this.data.selectedItems || [])];
    if (!selectedMap[name]) return;

    delete selectedMap[name];
    const idx = selectedItems.indexOf(name);
    if (idx >= 0) selectedItems.splice(idx, 1);

    this.setData({
      selectedMap,
      selectedItems
    });
  }
});
