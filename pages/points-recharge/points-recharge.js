// pages/points-recharge/points-recharge.js
Page({
  data: {
    statusBarHeight: 0,
    rechargeOptions: [
      { amount: 10, priceText: '￥1' },
      { amount: 30, priceText: '￥3' },
      { amount: 100, priceText: '￥10' }
    ]
  },

  onLoad() {
    const sys = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sys.statusBarHeight || 0
    });

    this.ensurePointsInitialized();
  },

  onBack() {
    wx.navigateBack({
      delta: 1
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

  onRechargeTap(e) {
    const amount = Number(e.currentTarget.dataset.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    const balanceRaw = wx.getStorageSync('points_balance');
    const balance = Number(balanceRaw);
    const safeBalance = Number.isFinite(balance) ? balance : 0;
    const newBalance = safeBalance + amount;

    wx.setStorageSync('points_balance', newBalance);

    const now = new Date();
    const pad2 = (n) => (n < 10 ? `0${n}` : String(n));
    const timeText = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

    const record = {
      id: Date.now(),
      bizType: 'recharge',
      title: `充值${amount}积分`,
      change: amount,
      balanceAfter: newBalance,
      timeText
    };

    const storedRecords = wx.getStorageSync('points_records');
    const list = Array.isArray(storedRecords) ? storedRecords : [];
    wx.setStorageSync('points_records', [record, ...list]);

    wx.showToast({
      title: `已充值+${amount}`,
      icon: 'success',
      duration: 500
    });

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 500);
  }
});
