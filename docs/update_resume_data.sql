-- ============================================
-- 简历数据导入脚本
-- 用户ID: 1
-- 姓名: 郑宇晨
-- 创建时间: 2026-02-15
-- ============================================

USE zhitongxiaoyuan;

-- ============================================
-- 第一步：清理旧数据
-- ============================================

-- 获取user_id=1的所有简历ID
SET @user_resume_ids = (SELECT GROUP_CONCAT(id) FROM resume WHERE user_id = 1 AND deleted = 0);

-- 删除关联的教育经历
DELETE FROM resume_education WHERE resume_id IN (SELECT id FROM resume WHERE user_id = 1);

-- 删除关联的实习经历
DELETE FROM resume_internship WHERE resume_id IN (SELECT id FROM resume WHERE user_id = 1);

-- 删除关联的项目经历
DELETE FROM resume_project WHERE resume_id IN (SELECT id FROM resume WHERE user_id = 1);

-- 删除关联的获奖经历
DELETE FROM resume_award WHERE resume_id IN (SELECT id FROM resume WHERE user_id = 1);

-- 删除简历主表数据
DELETE FROM resume WHERE user_id = 1;

-- ============================================
-- 第二步：插入简历主表数据
-- ============================================

INSERT INTO resume (
    user_id,
    name,
    gender,
    birth_date,
    phone,
    email,
    education,
    school,
    major,
    graduation_date,
    job_intention,
    expected_city,
    expected_salary,
    self_evaluation,
    skills
) VALUES (
    1,
    '郑宇晨',
    '男',
    '2005-01-01',
    '15259631513',
    '1159316668@qq.com',
    '本科',
    '武夷学院',
    '计算机科学与技术',
    '2027-07-01',
    '前端/AI岗',
    '厦门',
    '4-8K',
    '热爱学习，适应能力强，愿意从零开始钻研新技术，熟练使用grok、gpt、claude等大模型。项目与工程实践能力突出，曾独立或协作完成多个跨领域项目。',
    '熟练掌握JavaScript、HTML5、CSS3三件套，熟悉Vue2、Vue3、Uniapp等主流市场框架。拓展TypeScript前端技术，具备使用Vite、Webpack等脚手架的经验，熟悉Git等常用开发工具。'
);

-- 获取刚插入的简历ID
SET @resume_id = LAST_INSERT_ID();

-- ============================================
-- 第三步：插入教育经历
-- ============================================

INSERT INTO resume_education (
    resume_id,
    school,
    major,
    education,
    start_date,
    end_date,
    description
) VALUES (
    @resume_id,
    '武夷学院',
    '计算机科学与技术',
    '本科',
    '2023-09-01',
    '2027-07-01',
    '大一大二大三担任副班长'
);

-- ============================================
-- 第四步：插入实习经历
-- ============================================

INSERT INTO resume_internship (
    resume_id,
    company,
    position,
    start_date,
    end_date,
    description
) VALUES (
    @resume_id,
    '安踏(中国)有限公司厦门分公司',
    '机器人运动控制强化学习工程师',
    '2024-07-01',
    '2024-09-30',
    '在安踏运动科学实验室开展机器人运动控制相关的强化学习研究工作'
);

-- ============================================
-- 第五步：插入项目经历
-- ============================================

-- 项目1：Compusdash外卖调度系统
INSERT INTO resume_project (
    resume_id,
    name,
    role,
    start_date,
    end_date,
    description
) VALUES (
    @resume_id,
    'Compusdash外卖调度系统',
    '前端开发工程师',
    '2024-04-01',
    '2024-06-30',
    '技术栈：Vue3、Uniapp、百度/高德地图API、贪心算法、A*算法

1. 本项目为高校场景下的智能外卖调度系统
2. 使用 Uniapp 框架开发跨端小程序界面
3. 负责接入高德/百度地图API，实现路径规划和配送优化'
);

-- 项目2：金刚狼小程序开发改造
INSERT INTO resume_project (
    resume_id,
    name,
    role,
    start_date,
    end_date,
    description
) VALUES (
    @resume_id,
    '金刚狼小程序开发改造',
    '前端开发工程师',
    '2025-07-01',
    '2025-09-30',
    '技术栈：Vue3、TypeScript、Uniapp

1. 基于源app项目改造的智能鞋蓝牙控制小程序
2. 采用组合式API开发，提升代码可维护性和性能'
);

-- 项目3：强化学习与机器人控制研究
INSERT INTO resume_project (
    resume_id,
    name,
    role,
    start_date,
    end_date,
    description
) VALUES (
    @resume_id,
    '强化学习与机器人控制研究',
    '强化学习工程师',
    '2024-07-01',
    '2024-09-30',
    '技术栈：Python、Isaac Gym、PPO/TRPO

1. 在安踏运动科学实验室开展机器人运动控制的强化学习算法研究
2. 使用Isaac Gym仿真环境进行机器人训练
3. 实现并优化PPO和TRPO强化学习算法'
);

-- ============================================
-- 第六步：插入获奖经历
-- ============================================

-- 奖项1：2024届蓝桥杯Web组
INSERT INTO resume_award (
    resume_id,
    name,
    level,
    award_date,
    description
) VALUES (
    @resume_id,
    '蓝桥杯Web应用开发组',
    '福建省二等奖',
    '2024-05-01',
    NULL
);

-- 奖项2：2025届蓝桥杯C/C++组
INSERT INTO resume_award (
    resume_id,
    name,
    level,
    award_date,
    description
) VALUES (
    @resume_id,
    '蓝桥杯C/C++程序设计组',
    '福建省二等奖',
    '2025-05-01',
    NULL
);

-- 奖项3：互联网+比赛
INSERT INTO resume_award (
    resume_id,
    name,
    level,
    award_date,
    description
) VALUES (
    @resume_id,
    '全国大学生互联网+创新创业大赛',
    '二等奖',
    '2025-10-01',
    NULL
);

-- 奖项4：武夷学院科技节
INSERT INTO resume_award (
    resume_id,
    name,
    level,
    award_date,
    description
) VALUES (
    @resume_id,
    '武夷学院科技节软件设计大赛',
    '二等奖',
    '2025-11-01',
    NULL
);

-- ============================================
-- 完成提示
-- ============================================

SELECT '简历数据导入完成！' AS message;
SELECT @resume_id AS '新建简历ID';

-- 验证数据
SELECT * FROM resume WHERE id = @resume_id;
SELECT COUNT(*) AS '教育经历数量' FROM resume_education WHERE resume_id = @resume_id;
SELECT COUNT(*) AS '实习经历数量' FROM resume_internship WHERE resume_id = @resume_id;
SELECT COUNT(*) AS '项目经历数量' FROM resume_project WHERE resume_id = @resume_id;
SELECT COUNT(*) AS '获奖经历数量' FROM resume_award WHERE resume_id = @resume_id;
