// pages/resume-option-select/resume-option-select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    resumeId: '',
    type: '',
    title: '请选择',
    query: '',
    items: [],
    displayItems: [],
    selectedItems: [],
    selectedMap: {}
  },

  getEducationStorageKey() {
    return `resume_education_${this.data.resumeId}`;
  },

  loadExistingSelection() {
    const stored = wx.getStorageSync(this.getEducationStorageKey()) || {};
    const type = this.data.type;
    const picked = stored && stored[type];
    const name = picked && picked.name ? String(picked.name) : '';
    if (!name) {
      this.setData({
        selectedItems: [],
        selectedMap: {}
      });
      return;
    }
    this.setData({
      selectedItems: [name],
      selectedMap: {
        [name]: true
      }
    });
  },

  getItemsByType(type) {
    if (type === 'degree') {
      return ['专科', '本科', '硕士', '博士'];
    }
    if (type === 'studyMode') {
      return ['全日制', '非全日制'];
    }
    if (type === 'majorCategory') {
      return [
        '计算机科学与技术',
        '软件工程',
        '电子信息工程',
        '机械工程',
        '经济学',
        '管理学',
        '文学',
        '理学',
        '工学',
        '医学',
        '法学',
        '教育学',
        '艺术学',
        '其他'
      ];
    }
    if (type === 'school') {
      return [
        '清华大学',
        '北京大学',
        '复旦大学',
        '上海交通大学',
        '浙江大学',
        '南京大学',
        '中国科学技术大学',
        '武汉大学',
        '华中科技大学',
        '中山大学',
        '四川大学',
        '西安交通大学',
        '哈尔滨工业大学',
        '厦门大学',
        '同济大学',
        '北京航空航天大学',
        '北京理工大学',
        '电子科技大学'
      ];
    }
    return [];
  },

  refreshDisplayItems() {
    const query = (this.data.query || '').trim().toLowerCase();
    const items = Array.isArray(this.data.items) ? this.data.items : [];
    const list = query
      ? items.filter((n) => String(n).toLowerCase().includes(query))
      : items;
    this.setData({
      displayItems: list.map((name) => ({ name }))
    });
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

    const selectedMap = {};
    const selectedItems = [name];
    selectedMap[name] = true;

    this.setData({
      selectedItems,
      selectedMap
    });
  },

  onRemoveSelected() {
    this.setData({
      selectedItems: [],
      selectedMap: {}
    });
  },

  onConfirm() {
    const type = this.data.type;
    const selectedItems = Array.isArray(this.data.selectedItems) ? this.data.selectedItems : [];
    if (!type) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      return;
    }
    if (!selectedItems.length) {
      wx.showToast({
        title: '请选择一项',
        icon: 'none'
      });
      return;
    }

    const key = this.getEducationStorageKey();
    const stored = wx.getStorageSync(key) || {};
    const patch = {
      ...stored,
      [type]: {
        name: selectedItems[0]
      }
    };
    wx.setStorageSync(key, patch);

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

  onBack() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const sys = wx.getSystemInfoSync();
    const type = (options && options.type) || '';
    const title = (options && options.title) || '请选择';
    const resumeId = (options && options.id) || '';
    const items = this.getItemsByType(type);
    this.setData(
      {
        statusBarHeight: sys.statusBarHeight || 0,
        type,
        title,
        resumeId,
        items
      },
      () => {
        this.loadExistingSelection();
        this.refreshDisplayItems();
      }
    );
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

  }
})