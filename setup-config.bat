@echo off
REM 微信小程序密钥配置脚本 (Windows)
REM 用于快速设置本地开发环境

echo ========================================
echo 微信小程序密钥配置脚本
echo ========================================
echo.

REM 检查配置模板是否存在
if not exist "src\main\resources\application-local.yml.template" (
    echo [错误] 找不到配置模板文件
    echo 请确保在项目根目录下运行此脚本
    pause
    exit /b 1
)

REM 检查本地配置是否已存在
if exist "src\main\resources\application-local.yml" (
    echo [提示] 本地配置文件已存在
    choice /C YN /M "是否覆盖现有配置"
    if errorlevel 2 (
        echo 已取消配置
        pause
        exit /b 0
    )
)

REM 复制配置模板
echo [1/3] 复制配置模板...
copy "src\main\resources\application-local.yml.template" "src\main\resources\application-local.yml" >nul
if errorlevel 1 (
    echo [错误] 复制配置模板失败
    pause
    exit /b 1
)
echo [完成] 配置模板已复制

REM 提示用户填入配置
echo.
echo [2/3] 请填入微信小程序配置
echo.
set /p APPID="请输入 AppID (默认: wxa1f6632efb5a19e5): "
if "%APPID%"=="" set APPID=wxa1f6632efb5a19e5

set /p SECRET="请输入 AppSecret (默认: 78433b13eeeb5c04add01850248be9ba): "
if "%SECRET%"=="" set SECRET=78433b13eeeb5c04add01850248be9ba

REM 写入配置
echo.
echo [3/3] 写入配置文件...
(
    echo # 本地开发环境配置文件
    echo # 此文件包含敏感信息，已添加到 .gitignore，不会提交到 Git 仓库
    echo.
    echo # 微信小程序配置
    echo wechat:
    echo   appid: %APPID%
    echo   secret: %SECRET%
) > "src\main\resources\application-local.yml"

echo [完成] 配置文件已创建
echo.
echo ========================================
echo 配置完成！
echo ========================================
echo.
echo 配置文件位置: src\main\resources\application-local.yml
echo.
echo 注意事项:
echo 1. 此文件已添加到 .gitignore，不会提交到 Git
echo 2. 请妥善保管你的 AppSecret
echo 3. 现在可以启动应用了: mvn spring-boot:run
echo.
pause
