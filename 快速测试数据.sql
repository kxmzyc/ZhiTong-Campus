-- 快速测试用SQL - 直接复制到数据库管理工具执行

USE zhitongxiaoyuan;

-- 1. 插入简历基本信息
INSERT INTO `resume` (`user_id`, `name`, `gender`, `birth_date`, `phone`, `email`, `education`, `school`, `major`, `graduation_date`, `job_intention`, `expected_city`, `expected_salary`, `self_evaluation`, `skills`)
VALUES (1, '张小明', '男', '2001-05-15', '13800138000', 'zhangxiaoming@example.com', '本科', '北京大学', '计算机科学与技术', '2024-06-30', 'Java后端开发工程师', '北京/上海/深圳', '10K-15K',
'本人性格开朗，积极向上，具有良好的团队协作精神和沟通能力。在校期间成绩优异，多次获得奖学金。热爱编程，对新技术充满热情，具有较强的学习能力和解决问题的能力。',
'Java、Spring Boot、MySQL、Redis、微信小程序开发\nGit版本控制、Linux基础操作\n熟悉RESTful API设计');

-- 2. 插入教育经历（使用简历ID=1）
INSERT INTO `resume_education` (`resume_id`, `school`, `major`, `education`, `start_date`, `end_date`, `description`)
VALUES (1, '北京大学', '计算机科学与技术', '本科', '2020-09-01', '2024-06-30', '主修课程：数据结构与算法、操作系统、计算机网络\nGPA：3.8/4.0，专业排名前10%');

-- 3. 插入实习经历
INSERT INTO `resume_internship` (`resume_id`, `company`, `position`, `start_date`, `end_date`, `description`)
VALUES (1, '腾讯科技（深圳）有限公司', 'Java后端开发实习生', '2023-07-01', '2023-10-31', '参与微信支付后台系统的开发与维护\n优化数据库查询性能，响应时间提升70%\n使用Redis实现分布式缓存');

-- 4. 插入项目经历
INSERT INTO `resume_project` (`resume_id`, `name`, `role`, `start_date`, `end_date`, `description`)
VALUES (1, '智通校园招聘小程序', '后端负责人', '2023-11-01', '2024-01-31', '技术栈：Spring Boot + MyBatis-Plus + MySQL + Redis\n负责后端架构设计和核心功能开发\n成功上线运行，注册用户超过500人');

-- 5. 插入获奖经历
INSERT INTO `resume_award` (`resume_id`, `name`, `level`, `award_date`, `description`)
VALUES (1, '全国大学生程序设计竞赛', '省级二等奖', '2023-05-20', '参加ACM-ICPC程序设计竞赛，获得省级二等奖');

-- 6. 查询验证
SELECT '=== 简历基本信息 ===' AS info;
SELECT * FROM `resume` WHERE `id` = 1;

SELECT '=== 教育经历 ===' AS info;
SELECT * FROM `resume_education` WHERE `resume_id` = 1;

SELECT '=== 实习经历 ===' AS info;
SELECT * FROM `resume_internship` WHERE `resume_id` = 1;

SELECT '=== 项目经历 ===' AS info;
SELECT * FROM `resume_project` WHERE `resume_id` = 1;

SELECT '=== 获奖经历 ===' AS info;
SELECT * FROM `resume_award` WHERE `resume_id` = 1;
