# 图片资源说明

## 需要添加的图片

为了让登录页面正常显示,请在 `images` 目录下添加以下图片:

### 1. Logo 图片
**路径**: `/images/logo.png`
**尺寸**: 建议 512x512 像素
**格式**: PNG (支持透明背景)
**说明**: 应用的 Logo,显示在登录页面顶部

### 2. 默认头像
**路径**: `/images/default-avatar.png`
**尺寸**: 建议 200x200 像素
**格式**: PNG
**说明**: 用户未选择头像时的占位图

## 快速创建占位图片

如果暂时没有设计好的图片,可以使用以下方法创建占位图:

### 方法1: 使用在线工具
访问 https://placeholder.com/ 或类似网站生成占位图

### 方法2: 使用纯色图片
1. 打开画图工具或 Photoshop
2. 创建 512x512 的画布
3. 填充品牌色 (#667eea)
4. 保存为 logo.png

### 方法3: 使用 base64 图片
在 login.wxml 中,可以临时使用 base64 图片:

```xml
<!-- 临时 Logo -->
<image class="logo" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23667eea'/%3E%3C/svg%3E" mode="aspectFit"></image>

<!-- 临时默认头像 -->
<image
  class="avatar-image"
  src="{{avatarUrl || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'%23cccccc\'/%3E%3C/svg%3E'}}"
  mode="aspectFill"
></image>
```

## 目录结构

```
ZhiTongXiaoYuan/
├── images/
│   ├── logo.png          (需要添加)
│   └── default-avatar.png (需要添加)
└── pages/
    └── login/
        ├── login.js
        ├── login.json
        ├── login.wxml
        └── login.wxss
```

## 注意事项

1. 图片文件名必须与代码中引用的路径一致
2. 建议使用 PNG 格式以支持透明背景
3. 图片大小建议控制在 100KB 以内
4. 如果图片路径错误,页面会显示空白或裂图
