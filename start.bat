@echo off
chcp 65001
echo ====================================
echo 学生宿舍管理系统 (Java版)
echo ====================================
echo.
echo 正在启动系统...
echo.

REM 检查Java环境
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Java环境，请先安装JDK 1.8或更高版本
    echo 下载地址: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

echo 正在编译打包...
call mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo.
    echo [错误] 编译失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo 启动服务器...
echo.
echo 访问地址: http://localhost:8080
echo 管理员账号: admin / admin123
echo.
echo 按 Ctrl+C 停止服务器
echo ====================================
echo.

java -jar target/dorm-system-1.0.0.jar

pause
