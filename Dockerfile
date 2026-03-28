# 使用 OpenJDK 8 轻量级镜像
FROM openjdk:8-jdk-alpine

# 设置工作目录
WORKDIR /app

# 拷贝打包后的 jar 文件
COPY target/*.jar app.jar

# 暴露服务端口
EXPOSE 8080

# 启动命令
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
