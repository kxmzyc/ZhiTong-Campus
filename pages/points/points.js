// pages/points/points.js
Page({
  data: {
    statusBarHeight: 0,
    pointsBalance: 0,
    records: []
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });

    this.ensurePointsInitialized();
    this.refreshData();
  },

  onShow() {
    this.refreshData();
  },

  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  onGoRecharge() {
    wx.navigateTo({
      url: '/pages/points-recharge/points-recharge'
    });
  },

  ensurePointsInitialized() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    if (!Number.isFinite(balance)) {
      wx.setStorageSync('points_balance', 0);
    }

    const records = wx.getStorageSync('points_records');
    if (!Array.isArray(records)) {
      wx.setStorageSync('points_records', []);
    }
  },

  refreshData() {
    const balanceRaw = wx.getStorageSync('points_balance');
    const balance = Number(balanceRaw);
    const safeBalance = Number.isFinite(balance) ? balance : 0;

    const storedRecords = wx.getStorageSync('points_records');
    const bizTypeTextMap = {
      recharge: '充值',
      chat: '小助手对话',
      ai_select: 'AI智选投递',
      ai_auto: 'AI自动投递',
      ai_resume_opt: 'AI优化简历'
    };
    const list = Array.isArray(storedRecords)
      ? storedRecords.map((r) => ({
        ...r,
        bizType: r && r.bizType ? r.bizType : 'unknown'
      }))
      : [];

    const displayList = list.map((r) => ({
      ...r,
      bizTypeText: bizTypeTextMap[r.bizType] || '其他'
    }));

    this.setData({
      pointsBalance: safeBalance,
      records: displayList
    });
  }
});
