@echo off
chcp 65001
echo ====================================
echo 智通校园后端服务启动脚本
echo ====================================
echo.

echo 正在检查 Maven...
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Maven，请确保 Maven 已安装并配置到系统环境变量
    echo.
    echo 请使用 IntelliJ IDEA 启动项目：
    echo 1. 打开 IDEA
    echo 2. 打开项目：G:\claude\ZhiTongXiaoYuan
    echo 3. 找到 ZhiTongXiaoYuanApplication.java
    echo 4. 右键点击，选择 Run
    echo.
    pause
    exit /b 1
)

echo Maven 已找到
echo.

echo 正在检查 MySQL 连接...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p041029 -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 无法连接到 MySQL，请检查：
    echo 1. MySQL 服务是否启动
    echo 2. 密码是否正确（当前密码：041029）
    echo.
    pause
    exit /b 1
)

echo MySQL 连接成功
echo.

echo 正在检查数据库...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p041029 -e "USE zhitongxiaoyuan; SELECT COUNT(*) FROM job;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 数据库或表不存在，请先执行初始化脚本
    echo.
    pause
    exit /b 1
)

echo 数据库检查通过
echo.

echo 正在启动后端服务...
echo 请等待，首次启动可能需要下载依赖...
echo.

cd /d "%~dp0"
mvn spring-boot:run

pause
