#!/bin/bash
# 微信小程序密钥配置脚本 (Linux/Mac)
# 用于快速设置本地开发环境

echo "========================================"
echo "微信小程序密钥配置脚本"
echo "========================================"
echo ""

# 检查配置模板是否存在
if [ ! -f "src/main/resources/application-local.yml.template" ]; then
    echo "[错误] 找不到配置模板文件"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

# 检查本地配置是否已存在
if [ -f "src/main/resources/application-local.yml" ]; then
    echo "[提示] 本地配置文件已存在"
    read -p "是否覆盖现有配置? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "已取消配置"
        exit 0
    fi
fi

# 复制配置模板
echo "[1/3] 复制配置模板..."
cp "src/main/resources/application-local.yml.template" "src/main/resources/application-local.yml"
if [ $? -ne 0 ]; then
    echo "[错误] 复制配置模板失败"
    exit 1
fi
echo "[完成] 配置模板已复制"

# 提示用户填入配置
echo ""
echo "[2/3] 请填入微信小程序配置"
echo ""
read -p "请输入 AppID (默认: wxa1f6632efb5a19e5): " APPID
APPID=${APPID:-wxa1f6632efb5a19e5}

read -p "请输入 AppSecret (默认: 78433b13eeeb5c04add01850248be9ba): " SECRET
SECRET=${SECRET:-78433b13eeeb5c04add01850248be9ba}

# 写入配置
echo ""
echo "[3/3] 写入配置文件..."
cat > "src/main/resources/application-local.yml" << EOF
# 本地开发环境配置文件
# 此文件包含敏感信息，已添加到 .gitignore，不会提交到 Git 仓库

# 微信小程序配置
wechat:
  appid: $APPID
  secret: $SECRET
EOF

echo "[完成] 配置文件已创建"
echo ""
echo "========================================"
echo "配置完成！"
echo "========================================"
echo ""
echo "配置文件位置: src/main/resources/application-local.yml"
echo ""
echo "注意事项:"
echo "1. 此文件已添加到 .gitignore，不会提交到 Git"
echo "2. 请妥善保管你的 AppSecret"
echo "3. 现在可以启动应用了: mvn spring-boot:run"
echo ""
