// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointsBalance: 0,
    deepThinkingEnabled: false,
    historyOpen: false,
    historySessions: [],
    currentSessionId: 0,
    inputValue: '',
    toView: '',
    messages: [
      {
        id: 1,
        type: 'bot',
        content: 'Hi, 我是小助手, 很高兴见到你!'
      },
      {
        id: 2,
        type: 'bot',
        content: '可以直接告诉小助手, 你的目标岗位、意向城市, 或者点击下方快捷会话~'
      }
    ],
    suggestions: [
      '根据专业找适合的工作机会。',
      '热门行业有哪些?',
      '已有明确岗位意向, 给我一些求职建议。',
      '推荐一些热门校招岗位。',
      '对专业要求较低的工作机会。'
    ]
  },

  noop() {},

  loadPointsBalance() {
    const stored = wx.getStorageSync('points_balance');
    const balance = Number(stored);
    this.setData({
      pointsBalance: Number.isFinite(balance) ? balance : 0
    });
  },

  loadDeepThinkingSetting() {
    const stored = wx.getStorageSync('assistant_deep_thinking_enabled');
    this.setData({
      deepThinkingEnabled: stored === true || stored === 1 || stored === '1'
    });
  },

  persistDeepThinkingSetting(enabled) {
    wx.setStorageSync('assistant_deep_thinking_enabled', enabled ? 1 : 0);
  },

  onDeepThinkingTap() {
    const next = !this.data.deepThinkingEnabled;
    this.setData({
      deepThinkingEnabled: next
    });
    this.persistDeepThinkingSetting(next);
  },

  ensureHistoryInitialized() {
    const stored = wx.getStorageSync('assistant_history_sessions');
    if (!Array.isArray(stored)) {
      wx.setStorageSync('assistant_history_sessions', []);
    }
  },

  loadHistorySessions() {
    const stored = wx.getStorageSync('assistant_history_sessions');
    const list = Array.isArray(stored) ? stored : [];
    const sorted = [...list].sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    this.setData({
      historySessions: sorted.map((s) => ({
        id: s.id,
        updatedAt: s.updatedAt,
        previewText: s.previewText || '（空会话）'
      }))
    });
  },

  getHistorySessionsRaw() {
    const stored = wx.getStorageSync('assistant_history_sessions');
    return Array.isArray(stored) ? stored : [];
  },

  setHistorySessionsRaw(list) {
    wx.setStorageSync('assistant_history_sessions', list);
  },

  buildPreviewText(text) {
    const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return '（空会话）';
    return cleaned.length > 18 ? `${cleaned.slice(0, 18)}...` : cleaned;
  },

  createNewSession() {
    const id = Date.now();
    const updatedAt = Date.now();
    const session = {
      id,
      updatedAt,
      previewText: '（空会话）',
      messages: [...this.data.messages]
    };

    const list = this.getHistorySessionsRaw();
    this.setHistorySessionsRaw([session, ...list]);

    this.setData({
      currentSessionId: id
    });
  },

  upsertSessionMessages(sessionId, messages, lastUserText) {
    const list = this.getHistorySessionsRaw();
    const updatedAt = Date.now();
    const previewText = lastUserText ? this.buildPreviewText(lastUserText) : undefined;

    const idx = list.findIndex((s) => s && s.id === sessionId);
    if (idx >= 0) {
      const old = list[idx] || {};
      list[idx] = {
        ...old,
        id: sessionId,
        updatedAt,
        previewText: previewText || old.previewText || '（空会话）',
        messages
      };
    } else {
      list.unshift({
        id: sessionId,
        updatedAt,
        previewText: previewText || '（空会话）',
        messages
      });
    }

    list.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    this.setHistorySessionsRaw(list);
  },

  onHistoryTap() {
    this.ensureHistoryInitialized();
    this.loadHistorySessions();
    this.setData({
      historyOpen: !this.data.historyOpen
    });
  },

  closeHistory() {
    this.setData({
      historyOpen: false
    });
  },

  onNewChat() {
    this.ensureHistoryInitialized();

    const currentMessages = Array.isArray(this.data.messages) ? this.data.messages : [];
    let prevSessionId = this.data.currentSessionId;
    const now = Date.now();
    if (!prevSessionId) {
      prevSessionId = now;
    }

    let lastUserText = '';
    for (let i = currentMessages.length - 1; i >= 0; i -= 1) {
      const msg = currentMessages[i];
      if (msg && msg.type === 'user' && msg.content) {
        lastUserText = msg.content;
        break;
      }
    }

    this.upsertSessionMessages(prevSessionId, currentMessages, lastUserText);

    const initMessages = [
      {
        id: 1,
        type: 'bot',
        content: 'Hi, 我是小助手, 很高兴见到你!'
      },
      {
        id: 2,
        type: 'bot',
        content: '可以直接告诉小助手, 你的目标岗位、意向城市, 或者点击下方快捷会话~'
      }
    ];

    let newSessionId = Date.now();
    if (newSessionId === prevSessionId) {
      newSessionId = prevSessionId + 1;
    }

    this.setData({
      messages: initMessages,
      toView: '',
      inputValue: '',
      currentSessionId: newSessionId,
      historyOpen: false
    });

    this.upsertSessionMessages(newSessionId, initMessages);
    this.loadHistorySessions();
  },

  onSelectHistory(e) {
    const id = Number(e.currentTarget.dataset.id);
    if (!Number.isFinite(id) || id <= 0) return;

    const list = this.getHistorySessionsRaw();
    const session = list.find((s) => s && s.id === id);
    if (!session) return;

    const messages = Array.isArray(session.messages) ? session.messages : [];
    this.setData({
      currentSessionId: id,
      messages,
      toView: messages.length ? `msg-${messages[messages.length - 1].id}` : '',
      historyOpen: false
    });
  },

  onDeleteHistory(e) {
    const id = Number(e.currentTarget.dataset.id);
    if (!Number.isFinite(id) || id <= 0) return;

    const list = this.getHistorySessionsRaw();
    const next = list.filter((s) => s && s.id !== id);
    this.setHistorySessionsRaw(next);

    if (this.data.currentSessionId === id) {
      this.setData({
        currentSessionId: 0
      });
    }

    this.loadHistorySessions();
  },

  /**
   * 处理输入框变化
   */
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  /**
   * 处理建议点击
   */
  onSuggestionTap(e) {
    const suggestion = e.currentTarget.dataset.suggestion;
    this.setData(
      {
        inputValue: suggestion
      },
      () => {
        this.sendMessage();
      }
    );
  },

  /**
   * 跳转到校招页面
   */
  goToCampus() {
    wx.reLaunch({
      url: '/pages/campus/campus'
    });
  },

  goToResume() {
    wx.reLaunch({
      url: '/pages/resume/resume'
    });
  },

  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile?from=index'
    });
  },

  onPointsTap() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  /**
   * 发送消息
   */
  sendMessage() {
    const inputValue = this.data.inputValue.trim();
    if (!inputValue) return;

    const deepThinking = this.data.deepThinkingEnabled ? 1 : 0;

    // 添加用户消息
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      deepThinking
    };

    const userMessages = [...this.data.messages, newMessage];

    this.setData({
      messages: userMessages,
      inputValue: '',
      toView: `msg-${newMessage.id}`
    });

    this.ensureHistoryInitialized();
    let sessionId = this.data.currentSessionId;
    if (!sessionId) {
      const id = Date.now();
      sessionId = id;
      this.setData({
        currentSessionId: id
      });
    }
    this.upsertSessionMessages(sessionId, userMessages, inputValue);

    // 模拟机器人回复
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        type: 'bot',
        content: `收到你的消息: "${inputValue}"。小助手正在为您分析...`,
        deepThinking
      };

      const nextMessages = [...this.data.messages, botReply];
      this.setData({
        messages: nextMessages,
        toView: `msg-${botReply.id}`
      });
      this.upsertSessionMessages(sessionId, nextMessages, inputValue);
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadPointsBalance();
    this.loadDeepThinkingSetting();
    this.ensureHistoryInitialized();
    this.loadHistorySessions();
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
    this.loadPointsBalance();
    this.loadDeepThinkingSetting();
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