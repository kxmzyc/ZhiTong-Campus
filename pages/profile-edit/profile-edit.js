Page({
  data: {
    statusBarHeight: 0,
    form: {
      avatarPath: '',
      name: '',
      gender: '',
      degree: '',
      school: '',
      major: '',
      gradYear: '',
      gradMonth: '',
      email: '',
      intendedPositions: [],
      intendedIndustries: [],
      intendedCities: []
    },

    sheetVisible: false,
    sheetType: '',
    sheetTitle: '',

    pickerOptions: [],
    pickerValue: [0],
    tempPickerIndex: 0,

    gradYears: [],
    gradMonths: [],
    tempGradYearIndex: 0,
    tempGradMonthIndex: 0,

    schools: [],

    majorCategories: [],
    activeMajorCategoryKey: '',
    displayMajors: [],

    selectTabs: [],
    selectActiveKey: '',
    selectDisplayItems: [],
    selectSelectedItems: [],
    selectSelectedMap: {},
    selectQuery: '',
    selectIsSearching: false,
    selectPlaceholder: ''
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });

    this.initGradPicker();
    this.initMajorData();
    this.initSchools();
    this.loadFromStorage();
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '基本信息'
    });
  },

  loadFromStorage() {
    const basic = wx.getStorageSync('profile_basic_info') || {};
    const form = {
      avatarPath: basic.avatarPath || '',
      name: basic.name || '',
      gender: basic.gender || '',
      degree: basic.degree || '',
      school: basic.school || '',
      major: basic.major || '',
      gradYear: basic.gradYear || '',
      gradMonth: basic.gradMonth || '',
      email: basic.email || '',
      intendedPositions: Array.isArray(basic.intendedPositions) ? basic.intendedPositions : [],
      intendedIndustries: Array.isArray(basic.intendedIndustries) ? basic.intendedIndustries : [],
      intendedCities: Array.isArray(basic.intendedCities) ? basic.intendedCities : []
    };

    this.setData({
      form
    });
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  noop() {},

  onChooseAvatar() {
    const choose = wx.chooseMedia
      ? wx.chooseMedia
      : (opts) => wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths || [];
          const files = tempFilePaths.map((p) => ({ tempFilePath: p }));
          opts.success && opts.success({ tempFiles: files });
        },
        fail: opts.fail
      });

    choose({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const files = (res && res.tempFiles) || [];
        const path = files.length ? (files[0].tempFilePath || '') : '';
        if (!path) return;

        const lower = String(path).toLowerCase();
        const ok = lower.endsWith('.jpg') || lower.endsWith('.jpeg');
        if (!ok) {
          wx.showToast({
            title: '仅支持jpg/jpeg',
            icon: 'none'
          });
          return;
        }

        this.setData({
          'form.avatarPath': path
        });
      }
    });
  },

  onNameInput(e) {
    const value = (e.detail && e.detail.value) || '';
    this.setData({
      'form.name': value
    });
  },

  onEmailInput(e) {
    const value = (e.detail && e.detail.value) || '';
    this.setData({
      'form.email': value
    });
  },

  validateName(name) {
    const s = (name || '').trim();
    if (!s) return { ok: false, msg: '请输入姓名' };
    if (s.length < 2 || s.length > 20) return { ok: false, msg: '姓名长度2-20位' };
    const re = /^[\u4e00-\u9fa5A-Za-z·\s]+$/;
    if (!re.test(s)) return { ok: false, msg: '姓名仅支持中英文与·' };
    return { ok: true, value: s };
  },

  validateEmail(email) {
    const s = (email || '').trim();
    if (!s) return { ok: true, value: '' };
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!re.test(s)) return { ok: false, msg: '邮箱格式不正确' };
    return { ok: true, value: s };
  },

  onSave() {
    const nameCheck = this.validateName(this.data.form.name);
    if (!nameCheck.ok) {
      wx.showToast({ title: nameCheck.msg, icon: 'none' });
      return;
    }

    const emailCheck = this.validateEmail(this.data.form.email);
    if (!emailCheck.ok) {
      wx.showToast({ title: emailCheck.msg, icon: 'none' });
      return;
    }

    const form = {
      ...(this.data.form || {}),
      name: nameCheck.value,
      email: emailCheck.value
    };

    wx.setStorageSync('profile_basic_info', form);

    wx.showToast({
      title: '已保存',
      icon: 'success',
      duration: 400
    });

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 150);
  },

  openGenderSheet() {
    const options = ['男', '女'];
    const current = this.data.form.gender;
    const idx = current ? Math.max(0, options.indexOf(current)) : 0;
    this.setData({
      sheetVisible: true,
      sheetType: 'gender',
      sheetTitle: '选择性别',
      pickerOptions: options,
      pickerValue: [idx],
      tempPickerIndex: idx
    });
  },

  openDegreeSheet() {
    const options = ['本科', '硕士', '博士'];
    const current = this.data.form.degree;
    const idx = current ? Math.max(0, options.indexOf(current)) : 0;
    this.setData({
      sheetVisible: true,
      sheetType: 'degree',
      sheetTitle: '选择最高学历',
      pickerOptions: options,
      pickerValue: [idx],
      tempPickerIndex: idx
    });
  },

  openGradSheet() {
    const { gradYears, gradMonths } = this.data;
    const y = this.data.form.gradYear;
    const m = this.data.form.gradMonth;

    let yi = 0;
    let mi = 0;

    if (y) {
      const found = gradYears.indexOf(String(y));
      if (found >= 0) yi = found;
    }

    if (m) {
      const foundM = gradMonths.indexOf(String(m));
      if (foundM >= 0) mi = foundM;
    }

    this.setData({
      sheetVisible: true,
      sheetType: 'grad',
      sheetTitle: '选择毕业时间',
      pickerValue: [yi, mi],
      tempGradYearIndex: yi,
      tempGradMonthIndex: mi
    });
  },

  openSchoolSheet() {
    this.setData({
      sheetVisible: true,
      sheetType: 'school',
      sheetTitle: '选择毕业院校'
    });
  },

  openMajorSheet() {
    this.setData({
      sheetVisible: true,
      sheetType: 'major',
      sheetTitle: '选择专业院系'
    });

    if (!this.data.activeMajorCategoryKey && this.data.majorCategories.length) {
      const firstKey = this.data.majorCategories[0].key;
      this.setData({
        activeMajorCategoryKey: firstKey
      }, () => this.refreshDisplayMajors());
    } else {
      this.refreshDisplayMajors();
    }
  },

  openIntendedPositionSheet() {
    this.openSelectSheet('intendedPosition');
  },

  openIntendedIndustrySheet() {
    this.openSelectSheet('intendedIndustry');
  },

  openIntendedCitySheet() {
    this.openSelectSheet('intendedCity');
  },

  onSheetMaskTap() {
    this.closeSheet();
  },

  onSheetCancel() {
    this.closeSheet();
  },

  closeSheet() {
    this.setData({
      sheetVisible: false,
      sheetType: '',
      sheetTitle: '',
      selectQuery: '',
      selectIsSearching: false
    });
  },

  onPickerChange(e) {
    const value = (e.detail && e.detail.value) || [0];
    const idx = Array.isArray(value) && value.length ? value[0] : 0;
    this.setData({
      pickerValue: [idx],
      tempPickerIndex: idx
    });
  },

  onGradPickerChange(e) {
    const value = (e.detail && e.detail.value) || [0, 0];
    const yi = Array.isArray(value) && value.length ? (value[0] || 0) : 0;
    const mi = Array.isArray(value) && value.length > 1 ? (value[1] || 0) : 0;

    this.setData({
      pickerValue: [yi, mi],
      tempGradYearIndex: yi,
      tempGradMonthIndex: mi
    });
  },

  onSheetConfirm() {
    const type = this.data.sheetType;

    if (type === 'gender' || type === 'degree') {
      const idx = this.data.tempPickerIndex || 0;
      const options = this.data.pickerOptions || [];
      const val = options[idx] || '';
      if (type === 'gender') {
        this.setData({
          'form.gender': val
        });
      } else {
        this.setData({
          'form.degree': val
        });
      }
      this.closeSheet();
      return;
    }

    if (type === 'grad') {
      const yi = this.data.tempGradYearIndex || 0;
      const mi = this.data.tempGradMonthIndex || 0;
      const year = (this.data.gradYears || [])[yi] || '';
      const month = (this.data.gradMonths || [])[mi] || '';
      this.setData({
        'form.gradYear': year,
        'form.gradMonth': month
      });
      this.closeSheet();
      return;
    }

    if (type === 'intendedPosition') {
      this.setData({
        'form.intendedPositions': [...(this.data.selectSelectedItems || [])]
      });
      this.closeSheet();
      return;
    }

    if (type === 'intendedIndustry') {
      this.setData({
        'form.intendedIndustries': [...(this.data.selectSelectedItems || [])]
      });
      this.closeSheet();
      return;
    }

    if (type === 'intendedCity') {
      this.setData({
        'form.intendedCities': [...(this.data.selectSelectedItems || [])]
      });
      this.closeSheet();
    }
  },

  initGradPicker() {
    const now = new Date();
    const start = now.getFullYear() - 10;
    const end = now.getFullYear() + 10;

    const years = [];
    for (let y = start; y <= end; y += 1) {
      years.push(String(y));
    }

    const months = [];
    for (let m = 1; m <= 12; m += 1) {
      months.push(m < 10 ? `0${m}` : String(m));
    }

    this.setData({
      gradYears: years,
      gradMonths: months
    });
  },

  initSchools() {
    const schools = [
      '清华大学',
      '北京大学',
      '复旦大学',
      '上海交通大学',
      '浙江大学',
      '南京大学',
      '中国科学技术大学',
      '哈尔滨工业大学',
      '西安交通大学',
      '武汉大学',
      '华中科技大学',
      '中山大学',
      '四川大学',
      '山东大学',
      '厦门大学',
      '吉林大学',
      '南开大学',
      '同济大学',
      '北京航空航天大学',
      '北京理工大学',
      '天津大学',
      '东南大学',
      '华南理工大学',
      '重庆大学',
      '西北工业大学',
      '大连理工大学',
      '湖南大学',
      '中南大学',
      '电子科技大学',
      '华东师范大学',
      '北京师范大学',
      '中国人民大学',
      '北京邮电大学',
      '对外经济贸易大学',
      '中国政法大学',
      '中央财经大学',
      '北京交通大学',
      '上海财经大学',
      '华中师范大学',
      '东北大学',
      '兰州大学',
      '华东理工大学',
      '苏州大学',
      '暨南大学',
      '中国农业大学',
      '西南交通大学',
      '华南师范大学',
      '北京科技大学',
      '南京航空航天大学',
      '南京理工大学'
    ];

    this.setData({
      schools
    });
  },

  onSchoolPick(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    this.setData({
      'form.school': name
    });
    this.closeSheet();
  },

  initMajorData() {
    const majorCategories = [
      { key: 'cs', name: '计算机' },
      { key: 'ee', name: '电子信息' },
      { key: 'biz', name: '经管' },
      { key: 'design', name: '设计' }
    ];

    this.majorMap = {
      cs: ['计算机科学与技术', '软件工程', '网络工程', '人工智能', '数据科学与大数据技术'],
      ee: ['电子信息工程', '通信工程', '自动化', '微电子科学与工程'],
      biz: ['工商管理', '会计学', '金融学', '经济学', '市场营销'],
      design: ['视觉传达设计', '产品设计', '数字媒体艺术', '工业设计']
    };

    this.setData({
      majorCategories,
      activeMajorCategoryKey: majorCategories.length ? majorCategories[0].key : ''
    }, () => this.refreshDisplayMajors());
  },

  onMajorCategoryTap(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.activeMajorCategoryKey) return;

    this.setData({
      activeMajorCategoryKey: key
    }, () => this.refreshDisplayMajors());
  },

  refreshDisplayMajors() {
    const key = this.data.activeMajorCategoryKey;
    const list = (this.majorMap && this.majorMap[key]) ? this.majorMap[key] : [];
    const displayMajors = list.map((name) => ({ name }));
    this.setData({
      displayMajors
    });
  },

  onMajorPick(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;
    this.setData({
      'form.major': name
    });
    this.closeSheet();
  },

  openSelectSheet(type) {
    const selectData = this.getSelectDataByType(type);
    const selectedItems = this.getSelectedListByType(type);
    const selectedMap = {};
    selectedItems.forEach((n) => {
      selectedMap[n] = true;
    });

    this.setData({
      sheetVisible: true,
      sheetType: type,
      sheetTitle: this.getSelectTitle(type),
      selectTabs: selectData.tabs,
      selectActiveKey: selectData.activeKey,
      selectDisplayItems: selectData.items,
      selectSelectedItems: selectedItems,
      selectSelectedMap: selectedMap,
      selectQuery: '',
      selectIsSearching: false,
      selectPlaceholder: this.getSelectPlaceholder(type)
    });
  },

  getSelectTitle(type) {
    if (type === 'intendedPosition') return '选择意向职位';
    if (type === 'intendedIndustry') return '选择意向行业';
    if (type === 'intendedCity') return '选择意向城市';
    return '请选择';
  },

  getSelectPlaceholder(type) {
    if (type === 'intendedPosition') return '请输入职业';
    if (type === 'intendedIndustry') return '请输入行业';
    if (type === 'intendedCity') return '请输入城市';
    return '请输入';
  },

  getSelectedListByType(type) {
    const form = this.data.form || {};
    if (type === 'intendedPosition') return [...(form.intendedPositions || [])];
    if (type === 'intendedIndustry') return [...(form.intendedIndustries || [])];
    if (type === 'intendedCity') return [...(form.intendedCities || [])];
    return [];
  },

  getSelectDataByType(type) {
    if (type === 'intendedCity') {
      const tabs = this.getProvinceTabs();
      const activeKey = tabs.length ? tabs[0].key : 'hot';
      const items = this.getCitiesByProvinceKey(activeKey).map((name) => ({ name }));
      return { tabs, activeKey, items };
    }

    if (type === 'intendedIndustry') {
      const tabs = this.getIndustryCategoryTabs();
      const activeKey = tabs.length ? tabs[0].key : '';
      const items = this.getIndustriesByCategoryKey(activeKey).map((name) => ({ name }));
      return { tabs, activeKey, items };
    }

    const tabs = this.getPositionCategoryTabs();
    const activeKey = tabs.length ? tabs[0].key : '';
    const items = this.getPositionsByCategoryKey(activeKey).map((name) => ({ name }));
    return { tabs, activeKey, items };
  },

  onSelectTabTap(e) {
    const key = e.currentTarget.dataset.key;
    if (!key || key === this.data.selectActiveKey) return;

    const type = this.data.sheetType;
    const list = this.getItemsBySelectTypeAndKey(type, key);
    this.setData({
      selectActiveKey: key,
      selectQuery: '',
      selectIsSearching: false,
      selectDisplayItems: list.map((name) => ({ name }))
    });
  },

  onSelectQueryInput(e) {
    const value = (e.detail && e.detail.value) || '';
    this.setData(
      {
        selectQuery: value
      },
      () => {
        this.refreshSelectDisplayItems();
      }
    );
  },

  refreshSelectDisplayItems() {
    const type = this.data.sheetType;
    const query = (this.data.selectQuery || '').trim();
    const activeKey = this.data.selectActiveKey;

    let list = [];
    if (query) {
      const q = query.toLowerCase();
      const tabs = Array.isArray(this.data.selectTabs) ? this.data.selectTabs : [];
      const allKeys = tabs.map((t) => t.key);
      const allItems = [];
      allKeys.forEach((k) => {
        const items = this.getItemsBySelectTypeAndKey(type, k);
        items.forEach((it) => {
          allItems.push(it);
        });
      });
      const unique = Array.from(new Set(allItems));
      list = unique.filter((it) => String(it).toLowerCase().includes(q));
    } else {
      list = this.getItemsBySelectTypeAndKey(type, activeKey);
    }

    this.setData({
      selectDisplayItems: list.map((name) => ({ name })),
      selectIsSearching: !!query
    });
  },

  getItemsBySelectTypeAndKey(type, key) {
    if (type === 'intendedCity') return this.getCitiesByProvinceKey(key);
    if (type === 'intendedIndustry') return this.getIndustriesByCategoryKey(key);
    return this.getPositionsByCategoryKey(key);
  },

  onSelectToggle(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const selectedMap = { ...(this.data.selectSelectedMap || {}) };
    const selectedItems = [...(this.data.selectSelectedItems || [])];

    if (selectedMap[name]) {
      delete selectedMap[name];
      const idx = selectedItems.indexOf(name);
      if (idx >= 0) selectedItems.splice(idx, 1);
    } else {
      if (selectedItems.length >= 3) {
        wx.showToast({
          title: '最多选择3个',
          icon: 'none'
        });
        return;
      }
      selectedMap[name] = true;
      selectedItems.push(name);
    }

    this.setData({
      selectSelectedMap: selectedMap,
      selectSelectedItems: selectedItems
    });
  },

  onSelectRemove(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;

    const selectedMap = { ...(this.data.selectSelectedMap || {}) };
    const selectedItems = [...(this.data.selectSelectedItems || [])];
    if (!selectedMap[name]) return;

    delete selectedMap[name];
    const idx = selectedItems.indexOf(name);
    if (idx >= 0) selectedItems.splice(idx, 1);

    this.setData({
      selectSelectedMap: selectedMap,
      selectSelectedItems: selectedItems
    });
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

  getIndustryCategoryTabs() {
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

  getIndustriesByCategoryKey(key) {
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

  getPositionCategoryTabs() {
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
    ].map((k) => ({ key: k, name: k }));
  },

  getPositionsByCategoryKey(key) {
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
  }
});
