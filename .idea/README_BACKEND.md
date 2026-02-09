# 智通校园 - Spring Boot 后端项目

## 项目配置完成

### 技术栈
- Spring Boot 2.7.18
- MyBatis-Plus 3.5.3.1
- MySQL 8.0
- Maven

### 项目结构
```
src/main/java/com/example/zhitongxiaoyuan/
├── ZhiTongXiaoYuanApplication.java  # 主启动类
├── config/                           # 配置类
│   ├── CorsConfig.java              # 跨域配置
│   └── MyBatisPlusConfig.java       # MyBatis-Plus配置
├── controller/                       # 控制器层
│   └── TestController.java          # 测试控制器
├── service/                          # 服务层
├── mapper/                           # 数据访问层
└── entity/                           # 实体类
```

## IntelliJ IDEA 配置步骤

### 1. 打开项目
1. 打开 IntelliJ IDEA
2. 选择 `File` -> `Open`
3. 选择 `ZhiTongXiaoYuan` 文件夹
4. 点击 `OK`

### 2. 配置 Maven
1. IDEA 会自动识别 Maven 项目
2. 等待 Maven 依赖下载完成（右下角会显示进度）
3. 如果没有自动导入，点击右侧的 `Maven` 面板，点击刷新按钮

### 3. 配置数据库
1. 创建数据库：
```sql
CREATE DATABASE zhitongxiaoyuan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改配置文件 `src/main/resources/application.yml`：
   - 修改 `username` 为你的 MySQL 用户名
   - 修改 `password` 为你的 MySQL 密码
   - 如果 MySQL 端口不是 3306，需要修改 URL 中的端口号

### 4. 运行项目
1. 找到主类 `ZhiTongXiaoYuanApplication.java`
2. 右键点击，选择 `Run 'ZhiTongXiaoYuanApplication'`
3. 或者在顶部工具栏选择运行配置 `ZhiTongXiaoYuanApplication`，点击绿色运行按钮

### 5. 测试接口
项目启动后，访问：http://localhost:8080/api/hello

应该返回：
```json
{
  "code": 200,
  "message": "Hello from Spring Boot!",
  "data": "智通校园后端服务运行正常"
}
```

## 常见问题

### Maven 依赖下载慢
可以配置国内镜像源，在 Maven 的 `settings.xml` 中添加阿里云镜像：
```xml
<mirror>
  <id>aliyun</id>
  <mirrorOf>central</mirrorOf>
  <name>Aliyun Maven</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

### 数据库连接失败
1. 确认 MySQL 服务已启动
2. 确认用户名和密码正确
3. 确认数据库 `zhitongxiaoyuan` 已创建

### 端口被占用
如果 8080 端口被占用，可以在 `application.yml` 中修改端口号：
```yaml
server:
  port: 8081
```

## 下一步开发建议

1. 创建实体类（Entity）对应数据库表
2. 创建 Mapper 接口继承 BaseMapper
3. 创建 Service 接口和实现类
4. 创建 Controller 提供 RESTful API
5. 前端通过 API 与后端交互

## 开发工具推荐

### IDEA 插件
- Lombok：简化实体类代码
- MyBatisX：MyBatis 增强插件
- RestfulTool：API 测试工具
- GitToolBox：Git 增强工具
