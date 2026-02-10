// pages/login/login.js
const app = getApp();

Page({
  data: {
    avatarUrl: '', // 用户选择的头像
    nickName: '', // 用户输入的昵称
    loading: false // 登录加载状态
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    // 检查是否已登录
    if (app.checkLogin()) {
      // 已登录，直接跳转到首页
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  },

  /**
   * 用户选择头像
   */
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    console.log('用户选择头像:', avatarUrl);

    this.setData({
      avatarUrl: avatarUrl
    });
  },

  /**
   * 用户输入昵称
   */
  onNicknameChange(e) {
    const nickName = e.detail.value;
    console.log('用户输入昵称:', nickName);

    this.setData({
      nickName: nickName
    });
  },

  /**
   * 处理登录
   */
  handleLogin() {
    // 验证头像和昵称
    if (!this.data.avatarUrl) {
      wx.showToast({
        title: '请选择头像',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!this.data.nickName || this.data.nickName.trim() === '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 开始登录
    this.setData({ loading: true });

    // 调用微信登录获取 code
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('获取到 code:', res.code);

          // 调用后端登录接口
          this.loginToBackend(res.code);
        } else {
          console.error('获取 code 失败:', res.errMsg);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error('wx.login 调用失败:', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    });
  },

  /**
   * 调用后端登录接口
   */
  loginToBackend(code) {
    wx.request({
      url: 'http://localhost:8080/api/user/login',
      method: 'POST',
      data: {
        code: code,
        nickname: this.data.nickName.trim(),
        avatar: this.data.avatarUrl
      },
      success: (res) => {
        console.log('后端登录响应:', res.data);

        if (res.data.code === 200 && res.data.data) {
          const userInfo = res.data.data;

          // 保存用户信息到全局变量和本地缓存
          app.setUserInfo(userInfo);

          console.log('登录成功，用户信息:', userInfo);

          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });

          // 延迟跳转到首页
          setTimeout(() => {
            // 使用 reLaunch 跳转，可以跳转到任何页面
            wx.reLaunch({
              url: '/pages/index/index',
              success: () => {
                console.log('跳转到首页成功');
              },
              fail: (err) => {
                console.error('跳转到首页失败:', err);
              }
            });
          }, 1500);
        } else {
          console.error('登录失败:', res.data.message);
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none',
            duration: 2000
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error('请求后端登录接口失败:', err);
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        });
        this.setData({ loading: false });
      }
    });
  }
});
