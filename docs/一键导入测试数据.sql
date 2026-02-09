-- ============================================
-- 一键导入测试数据脚本
-- 使用方法：在IDEA Database窗口中执行此脚本
-- ============================================

-- 1. 切换到目标数据库
USE zhitongxiaoyuan;

-- 2. 清理可能存在的测试数据（可选，如果是第一次导入可以跳过）
-- DELETE FROM resume_award WHERE resume_id = 1;
-- DELETE FROM resume_project WHERE resume_id = 1;
-- DELETE FROM resume_internship WHERE resume_id = 1;
-- DELETE FROM resume_education WHERE resume_id = 1;
-- DELETE FROM resume WHERE id = 1;

-- 3. 插入简历基本信息
INSERT INTO `resume` (
    `user_id`, `name`, `gender`, `birth_date`, `phone`, `email`,
    `education`, `school`, `major`, `graduation_date`,
    `job_intention`, `expected_city`, `expected_salary`,
    `self_evaluation`, `skills`
) VALUES (
    1,
    '张小明',
    '男',
    '2001-05-15',
    '13800138000',
    'zhangxiaoming@example.com',
    '本科',
    '北京大学',
    '计算机科学与技术',
    '2024-06-30',
    'Java后端开发工程师',
    '北京/上海/深圳',
    '10K-15K',
    '本人性格开朗，积极向上，具有良好的团队协作精神和沟通能力。在校期间成绩优异，多次获得奖学金。热爱编程，对新技术充满热情，具有较强的学习能力和解决问题的能力。熟悉软件开发流程，有良好的代码规范意识。',
    'Java、Spring Boot、MySQL、Redis、微信小程序开发
Git版本控制、Linux基础操作
熟悉RESTful API设计
了解前端开发（HTML、CSS、JavaScript）
英语CET-6，具备良好的英文文档阅读能力'
);

-- 4. 插入教育经历
INSERT INTO `resume_education` (
    `resume_id`, `school`, `major`, `education`,
    `start_date`, `end_date`, `description`
) VALUES (
    1,
    '北京大学',
    '计算机科学与技术',
    '本科',
    '2020-09-01',
    '2024-06-30',
    '主修课程：数据结构与算法、操作系统、计算机网络、数据库原理、软件工程等
GPA：3.8/4.0，专业排名前10%
获得校级一等奖学金2次、二等奖学金1次'
);

-- 5. 插入实习经历
INSERT INTO `resume_internship` (
    `resume_id`, `company`, `position`,
    `start_date`, `end_date`, `description`
) VALUES (
    1,
    '腾讯科技（深圳）有限公司',
    'Java后端开发实习生',
    '2023-07-01',
    '2023-10-31',
    '• 参与微信支付后台系统的开发与维护，使用Spring Boot框架开发RESTful API
• 优化数据库查询性能，将关键接口响应时间从500ms降低到150ms，提升70%
• 使用Redis实现分布式缓存，提高系统并发处理能力
• 参与代码审查，编写单元测试，测试覆盖率达到85%以上
• 协助解决线上问题，积累了故障排查和问题定位的经验'
);

-- 6. 插入项目经历
INSERT INTO `resume_project` (
    `resume_id`, `name`, `role`,
    `start_date`, `end_date`, `description`
) VALUES (
    1,
    '智通校园招聘小程序',
    '后端负责人',
    '2023-11-01',
    '2024-01-31',
    '• 项目简介：面向大学生的校园招聘平台，提供职位浏览、简历管理、在线申请等功能
• 技术栈：Spring Boot + MyBatis-Plus + MySQL + Redis + 微信小程序
• 主要职责：
  - 负责后端架构设计和核心功能开发
  - 设计并实现RESTful API接口，包括用户管理、简历管理、职位管理等模块
  - 使用Redis实现缓存机制，提升系统性能
  - 编写接口文档，与前端团队协作完成功能对接
• 项目成果：成功上线运行，注册用户超过500人，获得良好反馈'
);

-- 7. 插入获奖经历
INSERT INTO `resume_award` (
    `resume_id`, `name`, `level`,
    `award_date`, `description`
) VALUES (
    1,
    '全国大学生程序设计竞赛',
    '省级二等奖',
    '2023-05-20',
    '参加ACM-ICPC程序设计竞赛，与团队成员协作解决算法问题，获得省级二等奖'
);

-- 8. 验证数据导入
SELECT '✅ 数据导入完成！' AS status;

SELECT '简历基本信息：' AS info;
SELECT id, name, gender, phone, email, school, education, major FROM `resume` WHERE `id` = 1;

SELECT '教育经历：' AS info;
SELECT id, school, major, education, start_date, end_date FROM `resume_education` WHERE `resume_id` = 1;

SELECT '实习经历：' AS info;
SELECT id, company, position, start_date, end_date FROM `resume_internship` WHERE `resume_id` = 1;

SELECT '项目经历：' AS info;
SELECT id, name, role, start_date, end_date FROM `resume_project` WHERE `resume_id` = 1;

SELECT '获奖经历：' AS info;
SELECT id, name, level, award_date FROM `resume_award` WHERE `resume_id` = 1;

SELECT '
🎉 测试数据导入成功！
📝 简历ID: 1
👤 姓名: 张小明

下一步：
1. 在微信开发者工具中打开项目
2. 确保已关闭域名校验
3. 访问简历预览页面，参数 id=1
' AS next_steps;
