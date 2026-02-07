Page({
  data: {
    statusBarHeight: 0,
    categoryTabs: [],
    activeCategoryKey: '移动互联网',
    query: '',
    isSearching: false,
    displayItems: [],
    selectedItems: [],
    selectedMap: {}
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const categoryTabs = this.getCategoryTabs();
    const selectedItems = wx.getStorageSync('campus_selected_positions') || [];
    const selectedMap = {};
    selectedItems.forEach((c) => {
      selectedMap[c] = true;
    });

    const firstKey = categoryTabs.length ? categoryTabs[0].key : '移动互联网';

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
      title: '职业'
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onConfirm() {
    const selectedItems = Array.isArray(this.data.selectedItems) ? this.data.selectedItems : [];
    wx.setStorageSync('campus_selected_positions', selectedItems);
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
    return this.getAllCategoryKeys().map((k) => ({ key: k, name: k }));
  },

  getAllCategoryKeys() {
    return [
      '移动互联网',
      '计算机软件',
      'IT服务',
      '半导体',
      '通信/网络设备',
      '人工智能/大数据',
      '银行/证券/基金',
      '保险',
      '互联网金融/金融科技',
      '投资/资管',
      '会计/审计/税务',
      '房地产开发',
      '建筑设计/规划',
      '工程施工',
      '装饰装修/建材',
      '工程咨询/监理',
      '车辆制造/配件',
      '机械/设备/重工',
      '电子/电器/半导体',
      '饮食/烟草',
      '医疗器械',
      '化工/能源/材料',
      '纺织/服装',
      '印刷/造纸',
      '零售/批发/电商',
      '进出口贸易',
      '物流/仓储',
      '供应链/采购',
      '医院/医疗机构',
      '生物医药/制药',
      '健康管理',
      '高等教育/职业院校',
      'K12教育/基础教育',
      '职业培训/技能培训',
      '广告/公关',
      '传媒/出版',
      '动漫/游戏',
      '电竞/体育',
      '新媒体/内容创作',
      '管理咨询/战略咨询',
      '人力资源服务',
      '法律/知识产权',
      '市场调研/数据分析',
      '电力/水利/热力',
      '石油/石化/化工',
      '新能源/清洁能源',
      '环保/节能/资源回收',
      '酒店/民宿/旅游',
      '餐饮/食品服务',
      '美容/美发/健身',
      '家政/物业/生活服务',
      '政府/公共事业',
      '非营利组织/NGO',
      '军队/国防相关'
    ];
  },

  getItemsByCategoryKey(key) {
    const map = {
      '移动互联网': ['电商平台', '社交网络', '在线服务'],
      '计算机软件': ['企业软件', '应用软件', '游戏开发'],
      'IT服务': ['云计算', '数据中心', '技术支持'],
      '半导体': ['芯片设计', '电子设备制造'],
      '通信/网络设备': ['运营商', '通信设备', '5G技术'],
      '人工智能/大数据': ['AI算法', '数据服务', '机器学习'],
      '银行/证券/基金': ['商业银行', '投资银行', '公募基金'],
      '保险': ['人寿险', '财产险', '保险经纪'],
      '互联网金融/金融科技': ['第三方支付', '区块链', '数字货币'],
      '投资/资管': ['私募基金', '风险投资', '财富管理'],
      '会计/审计/税务': ['会计师事务所', '财务咨询'],
      '房地产开发': ['住宅地产', '商业地产', '物业管理'],
      '建筑设计/规划': ['设计院', '建筑事务所'],
      '工程施工': ['房建', '市政', '路桥建设'],
      '装饰装修/建材': ['室内设计', '建材供应', '家装服务'],
      '工程咨询/监理': ['造价咨询', '工程管理', '招投标'],
      '车辆制造/配件': ['整车制造', '零部件', '新能源汽车'],
      '机械/设备/重工': ['工业自动化', '机床设备', '工程机械'],
      '电子/电器/半导体': ['消费电子', '家电制造', '集成电路'],
      '饮食/烟草': ['食品加工', '饮料生产', '快消品'],
      '医疗器械': ['医疗设备', '医用耗材', '康复器械'],
      '化工/能源/材料': ['石油化工', '新能源材料', '钢铁有色'],
      '纺织/服装': ['服装制造', '纺织品', '鞋帽箱包'],
      '印刷/造纸': ['包装印刷', '造纸业', '包装材料'],
      '零售/批发/电商': ['商超', '品牌专卖', '跨境电商'],
      '进出口贸易': ['外贸公司', '报关行', '国际贸易'],
      '物流/仓储': ['快递快运', '第三方物流', '冷链仓储'],
      '供应链/采购': ['采购管理', '供应商管理', '供应链优化'],
      '医院/医疗机构': ['公立医院', '私立医院', '专科诊所'],
      '生物医药/制药': ['生物制药', 'CRO/CMO', '疫苗研发'],
      '健康管理': ['体检中心', '康复护理', '养老护理'],
      '高等教育/职业院校': ['大学', '高职院校', '科研机构'],
      'K12教育/基础教育': ['中小学', '幼儿园', '课外辅导'],
      '职业培训/技能培训': ['IT培训', '语言培训', '职业考证'],
      '广告/公关': ['广告公司', '公关传播'],
      '传媒/出版': ['电视台', '影视制作', '新闻出版'],
      '动漫/游戏': ['游戏开发', '动漫制作'],
      '电竞/体育': ['电竞运营', '体育俱乐部'],
      '新媒体/内容创作': ['演出经纪', '自媒体', '直播平台', 'MCN机构'],
      '管理咨询/战略咨询': ['麦肯锡类', '四大咨询', '管理顾问'],
      '人力资源服务': ['猎头公司', '劳务派遣', '招聘服务'],
      '法律/知识产权': ['律师事务所', '专利代理', '知识产权服务'],
      '市场调研/数据分析': ['市场研究', '用户调研', '数据咨询'],
      '电力/水利/热力': ['发电厂', '电网', '水务集团', '燃气公司'],
      '石油/石化/化工': ['石油开采', '炼油化工', '新材料'],
      '新能源/清洁能源': ['光伏', '风电', '储能', '氢能'],
      '环保/节能/资源回收': ['环境治理', '污水处理', '固废处理'],
      '酒店/民宿/旅游': ['星级酒店', '连锁酒店', 'OTA平台', '旅行社'],
      '餐饮/食品服务': ['连锁餐饮', '团餐服务', '外卖配送'],
      '美容/美发/健身': ['医疗美容', '健身会所', '生活美容'],
      '家政/物业/生活服务': ['家政服务', '物业管理', '社区服务'],
      '政府/公共事业': ['政府机关', '事业单位', '行业协会'],
      '非营利组织/NGO': ['慈善机构', '社会团体', '国际组织'],
      '军队/国防相关': ['军工单位', '国防科研', '退伍军人服务']
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
          title: '最多选择3个职业',
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
