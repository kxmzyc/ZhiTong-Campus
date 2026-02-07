// pages/city-select/city-select.js
Page({
  data: {
    statusBarHeight: 0,
    provinceTabs: [],
    activeProvinceKey: 'hot',
    query: '',
    isSearching: false,
    displayCities: [],
    selectedCities: [],
    selectedMap: {}
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const provinceTabs = this.getProvinceTabs();
    const selectedCities = wx.getStorageSync('campus_selected_cities') || [];
    const selectedMap = {};
    selectedCities.forEach((c) => {
      selectedMap[c] = true;
    });

    this.setData(
      {
        statusBarHeight: sys.statusBarHeight || 0,
        provinceTabs,
        selectedCities,
        selectedMap
      },
      () => {
        this.refreshDisplayCities();
      }
    );
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '城市'
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onConfirm() {
    const selectedCities = Array.isArray(this.data.selectedCities) ? this.data.selectedCities : [];
    wx.setStorageSync('campus_selected_cities', selectedCities);
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

  getProvinceTabs() {
    const provinces = [
      '北京市',
      '天津市',
      '上海市',
      '重庆市',
      '河北省',
      '山西省',
      '内蒙古自治区',
      '辽宁省',
      '吉林省',
      '黑龙江省',
      '江苏省',
      '浙江省',
      '安徽省',
      '福建省',
      '江西省',
      '山东省',
      '河南省',
      '湖北省',
      '湖南省',
      '广东省',
      '广西壮族自治区',
      '海南省',
      '四川省',
      '贵州省',
      '云南省',
      '西藏自治区',
      '陕西省',
      '甘肃省',
      '青海省',
      '宁夏回族自治区',
      '新疆维吾尔自治区'
    ];

    return [
      { key: 'hot', name: '热门城市' },
      ...provinces.map((p) => ({ key: p, name: p })),
      { key: '特别行政区', name: '特别行政区' },
      { key: '台湾', name: '台湾' },
      { key: '外籍', name: '外籍' }
    ];
  },

  getCitiesByProvinceKey(key) {
    const hot = [
      '北京市',
      '上海市',
      '广州市',
      '深圳市',
      '杭州市',
      '成都市',
      '重庆市',
      '武汉市',
      '西安市',
      '南京市',
      '苏州市',
      '青岛市'
    ];

    const map = {
      hot,
      '北京市': ['北京市'],
      '天津市': ['天津市'],
      '上海市': ['上海市'],
      '重庆市': ['重庆市'],
      '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '保定市'],
      '山西省': ['太原市', '大同市', '长治市', '晋中市'],
      '内蒙古自治区': ['呼和浩特市', '包头市', '鄂尔多斯市'],
      '辽宁省': ['沈阳市', '大连市', '鞍山市', '锦州市'],
      '吉林省': ['长春市', '吉林市'],
      '黑龙江省': ['哈尔滨市', '齐齐哈尔市'],
      '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
      '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市'],
      '安徽省': ['合肥市', '芜湖市'],
      '福建省': ['福州市', '厦门市', '泉州市'],
      '江西省': ['南昌市', '赣州市'],
      '山东省': ['济南市', '青岛市', '烟台市', '潍坊市'],
      '河南省': ['郑州市', '洛阳市'],
      '湖北省': ['武汉市', '宜昌市'],
      '湖南省': ['长沙市', '株洲市'],
      '广东省': ['广州市', '深圳市', '佛山市', '东莞市'],
      '广西壮族自治区': ['南宁市', '桂林市'],
      '海南省': ['海口市', '三亚市'],
      '四川省': ['成都市', '绵阳市'],
      '贵州省': ['贵阳市', '遵义市'],
      '云南省': ['昆明市', '大理市'],
      '西藏自治区': ['拉萨市'],
      '陕西省': ['西安市', '咸阳市'],
      '甘肃省': ['兰州市'],
      '青海省': ['西宁市'],
      '宁夏回族自治区': ['银川市'],
      '新疆维吾尔自治区': ['乌鲁木齐市'],
      '特别行政区': ['特别行政区'],
      '台湾': ['台湾'],
      '外籍': ['外籍']
    };

    return map[key] || [];
  },

  refreshDisplayCities() {
    const query = (this.data.query || '').trim();
    const activeKey = this.data.activeProvinceKey;

    let list = [];
    if (query) {
      const q = query.toLowerCase();
      const allKeys = this.data.provinceTabs.map((t) => t.key);
      const allCities = [];
      allKeys.forEach((k) => {
        const cities = this.getCitiesByProvinceKey(k);
        cities.forEach((c) => {
          allCities.push(c);
        });
      });
      const unique = Array.from(new Set(allCities));
      list = unique.filter((c) => String(c).toLowerCase().includes(q));
    } else {
      list = this.getCitiesByProvinceKey(activeKey);
    }

    const displayCities = list.map((name) => ({ name }));
    this.setData({
      displayCities,
      isSearching: !!query
    });
  },

  onProvinceTap(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeProvinceKey) return;

    this.setData(
      {
        activeProvinceKey: key,
        query: ''
      },
      () => {
        this.refreshDisplayCities();
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
        this.refreshDisplayCities();
      }
    );
  },

  onCityToggle(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const selectedMap = { ...(this.data.selectedMap || {}) };
    const selectedCities = [...(this.data.selectedCities || [])];

    if (selectedMap[name]) {
      delete selectedMap[name];
      const idx = selectedCities.indexOf(name);
      if (idx >= 0) selectedCities.splice(idx, 1);
    } else {
      if (selectedCities.length >= 3) {
        wx.showToast({
          title: '最多选择3个城市',
          icon: 'none'
        });
        return;
      }
      selectedMap[name] = true;
      selectedCities.push(name);
    }

    this.setData(
      {
        selectedMap,
        selectedCities
      }
    );
  },

  onRemoveSelected(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const selectedMap = { ...(this.data.selectedMap || {}) };
    const selectedCities = [...(this.data.selectedCities || [])];
    if (!selectedMap[name]) return;

    delete selectedMap[name];
    const idx = selectedCities.indexOf(name);
    if (idx >= 0) selectedCities.splice(idx, 1);

    this.setData(
      {
        selectedMap,
        selectedCities
      }
    );
  }
});
