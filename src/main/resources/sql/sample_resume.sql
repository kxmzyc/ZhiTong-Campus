-- 示例简历数据
-- 使用前请确保已有用户数据，这里假设用户ID为1

USE zhitongxiaoyuan;

-- 插入示例简历基本信息
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
  '本人性格开朗，积极向上，具有良好的团队协作精神和沟通能力。在校期间成绩优异，多次获得奖学金。热爱编程，对新技术充满热情，具有较强的学习能力和解决问题的能力。熟悉软件开发流程，有良好的代码规范意识。希望能够加入贵公司，为公司的发展贡献自己的力量。',
  'Java、Spring Boot、MySQL、Redis、微信小程序开发\nGit版本控制、Linux基础操作\n熟悉RESTful API设计\n了解前端开发（HTML、CSS、JavaScript）\n英语CET-6，具备良好的英文文档阅读能力'
);

-- 获取刚插入的简历ID（假设为1，实际使用时需要根据实际情况调整）
SET @resume_id = LAST_INSERT_ID();

-- 插入教育经历
INSERT INTO `resume_education` (`resume_id`, `school`, `major`, `education`, `start_date`, `end_date`, `description`) VALUES
(@resume_id, '北京大学', '计算机科学与技术', '本科', '2020-09-01', '2024-06-30',
'主修课程：数据结构与算法、操作系统、计算机网络、数据库原理、软件工程等\nGPA：3.8/4.0，专业排名前10%\n获得校级一等奖学金2次、二等奖学金1次'),

(@resume_id, '北京市第一中学', NULL, '高中', '2017-09-01', '2020-06-30',
'理科实验班，高考成绩650分\n担任班级学习委员，组织多次学习交流活动');

-- 插入实习经历
INSERT INTO `resume_internship` (`resume_id`, `company`, `position`, `start_date`, `end_date`, `description`) VALUES
(@resume_id, '腾讯科技（深圳）有限公司', 'Java后端开发实习生', '2023-07-01', '2023-10-31',
'• 参与微信支付后台系统的开发与维护，使用Spring Boot框架开发RESTful API
• 优化数据库查询性能，将关键接口响应时间从500ms降低到150ms，提升70%
• 使用Redis实现分布式缓存，提高系统并发处理能力
• 参与代码审查，编写单元测试，测试覆盖率达到85%以上
• 协助解决线上问题，积累了故障排查和问题定位的经验'),

(@resume_id, '字节跳动科技有限公司', '后端开发实习生', '2023-03-01', '2023-06-30',
'• 参与抖音电商后台管理系统的开发，负责订单管理模块
• 使用MyBatis-Plus进行数据库操作，实现复杂的业务逻辑
• 对接第三方支付接口，完成支付流程的开发与测试
• 参与需求评审和技术方案设计，提升了系统设计能力
• 使用Git进行版本控制，遵循团队代码规范');

-- 插入项目经历
INSERT INTO `resume_project` (`resume_id`, `name`, `role`, `start_date`, `end_date`, `description`) VALUES
(@resume_id, '智通校园招聘小程序', '后端负责人', '2023-11-01', '2024-01-31',
'• 项目简介：面向大学生的校园招聘平台，提供职位浏览、简历管理、在线申请等功能
• 技术栈：Spring Boot + MyBatis-Plus + MySQL + Redis + 微信小程序
• 主要职责：
  - 负责后端架构设计和核心功能开发
  - 设计并实现RESTful API接口，包括用户管理、简历管理、职位管理等模块
  - 使用Redis实现缓存机制，提升系统性能
  - 编写接口文档，与前端团队协作完成功能对接
• 项目成果：成功上线运行，注册用户超过500人，获得良好反馈'),

(@resume_id, '在线图书管理系统', '全栈开发', '2022-09-01', '2022-12-31',
'• 项目简介：基于Web的图书管理系统，实现图书的增删改查、借阅归还等功能
• 技术栈：Spring Boot + Vue.js + MySQL + Element UI
• 主要职责：
  - 独立完成前后端开发，实现完整的业务流程
  - 后端使用Spring Boot搭建，实现用户认证、权限管理等功能
  - 前端使用Vue.js开发，实现响应式界面设计
  - 使用JWT实现用户身份认证和授权
• 项目成果：作为课程设计项目，获得优秀评价');

-- 插入获奖经历
INSERT INTO `resume_award` (`resume_id`, `name`, `level`, `award_date`, `description`) VALUES
(@resume_id, '全国大学生程序设计竞赛', '省级二等奖', '2023-05-20',
'参加ACM-ICPC程序设计竞赛，与团队成员协作解决算法问题，获得省级二等奖'),

(@resume_id, '北京大学优秀学生奖学金', '校级一等奖', '2022-12-15',
'学年综合成绩排名专业前5%，获得校级一等奖学金'),

(@resume_id, '蓝桥杯全国软件和信息技术专业人才大赛', '国家级三等奖', '2022-06-10',
'Java软件开发组，通过省赛晋级国赛，获得国家级三等奖'),

(@resume_id, '北京大学优秀学生干部', '校级荣誉', '2021-12-20',
'担任班级学习委员期间，组织学习交流活动，帮助同学提升学习成绩');

-- 查询插入的数据
SELECT '简历基本信息：' AS '';
SELECT * FROM `resume` WHERE `id` = @resume_id;

SELECT '教育经历：' AS '';
SELECT * FROM `resume_education` WHERE `resume_id` = @resume_id;

SELECT '实习经历：' AS '';
SELECT * FROM `resume_internship` WHERE `resume_id` = @resume_id;

SELECT '项目经历：' AS '';
SELECT * FROM `resume_project` WHERE `resume_id` = @resume_id;

SELECT '获奖经历：' AS '';
SELECT * FROM `resume_award` WHERE `resume_id` = @resume_id;
