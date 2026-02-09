-- 智通校园数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS zhitongxiaoyuan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE zhitongxiaoyuan;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` VARCHAR(100) NOT NULL COMMENT '微信openid',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `points_balance` INT DEFAULT 0 COMMENT '积分余额',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 简历表
CREATE TABLE IF NOT EXISTS `resume` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '简历ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别',
  `birth_date` DATE DEFAULT NULL COMMENT '出生日期',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `education` VARCHAR(20) DEFAULT NULL COMMENT '学历',
  `school` VARCHAR(100) DEFAULT NULL COMMENT '学校',
  `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
  `graduation_date` DATE DEFAULT NULL COMMENT '毕业时间',
  `job_intention` VARCHAR(100) DEFAULT NULL COMMENT '求职意向',
  `expected_city` VARCHAR(50) DEFAULT NULL COMMENT '期望城市',
  `expected_salary` VARCHAR(50) DEFAULT NULL COMMENT '期望薪资',
  `self_evaluation` TEXT DEFAULT NULL COMMENT '自我评价',
  `skills` TEXT DEFAULT NULL COMMENT '技能特长',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历表';

-- 教育经历表
CREATE TABLE IF NOT EXISTS `resume_education` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `resume_id` BIGINT NOT NULL COMMENT '简历ID',
  `school` VARCHAR(100) NOT NULL COMMENT '学校名称',
  `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
  `education` VARCHAR(20) DEFAULT NULL COMMENT '学历',
  `start_date` DATE DEFAULT NULL COMMENT '开始时间',
  `end_date` DATE DEFAULT NULL COMMENT '结束时间',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_resume_id` (`resume_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教育经历表';

-- 实习经历表
CREATE TABLE IF NOT EXISTS `resume_internship` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `resume_id` BIGINT NOT NULL COMMENT '简历ID',
  `company` VARCHAR(100) NOT NULL COMMENT '公司名称',
  `position` VARCHAR(100) DEFAULT NULL COMMENT '职位',
  `start_date` DATE DEFAULT NULL COMMENT '开始时间',
  `end_date` DATE DEFAULT NULL COMMENT '结束时间',
  `description` TEXT DEFAULT NULL COMMENT '工作描述',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_resume_id` (`resume_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='实习经历表';

-- 项目经历表
CREATE TABLE IF NOT EXISTS `resume_project` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `resume_id` BIGINT NOT NULL COMMENT '简历ID',
  `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
  `role` VARCHAR(50) DEFAULT NULL COMMENT '担任角色',
  `start_date` DATE DEFAULT NULL COMMENT '开始时间',
  `end_date` DATE DEFAULT NULL COMMENT '结束时间',
  `description` TEXT DEFAULT NULL COMMENT '项目描述',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_resume_id` (`resume_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目经历表';

-- 获奖经历表
CREATE TABLE IF NOT EXISTS `resume_award` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `resume_id` BIGINT NOT NULL COMMENT '简历ID',
  `name` VARCHAR(100) NOT NULL COMMENT '奖项名称',
  `level` VARCHAR(50) DEFAULT NULL COMMENT '奖项级别',
  `award_date` DATE DEFAULT NULL COMMENT '获奖时间',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_resume_id` (`resume_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='获奖经历表';

-- 职位表
CREATE TABLE IF NOT EXISTS `job` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '职位ID',
  `title` VARCHAR(100) NOT NULL COMMENT '职位名称',
  `company` VARCHAR(100) NOT NULL COMMENT '公司名称',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '工作城市',
  `salary_range` VARCHAR(50) DEFAULT NULL COMMENT '薪资范围',
  `education_required` VARCHAR(20) DEFAULT NULL COMMENT '学历要求',
  `experience_required` VARCHAR(50) DEFAULT NULL COMMENT '经验要求',
  `job_type` VARCHAR(20) DEFAULT NULL COMMENT '职位类型(全职/实习)',
  `industry` VARCHAR(50) DEFAULT NULL COMMENT '行业',
  `description` TEXT DEFAULT NULL COMMENT '职位描述',
  `requirements` TEXT DEFAULT NULL COMMENT '任职要求',
  `benefits` TEXT DEFAULT NULL COMMENT '福利待遇',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态(active/closed)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_city` (`city`),
  KEY `idx_industry` (`industry`),
  KEY `idx_job_type` (`job_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职位表';

-- 职位申请表
CREATE TABLE IF NOT EXISTS `job_application` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `job_id` BIGINT NOT NULL COMMENT '职位ID',
  `resume_id` BIGINT DEFAULT NULL COMMENT '简历ID',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态(pending/approved/rejected)',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_job_id` (`job_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职位申请表';

-- 收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `job_id` BIGINT NOT NULL COMMENT '职位ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_job` (`user_id`, `job_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_job_id` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 聊天会话表
CREATE TABLE IF NOT EXISTS `chat_session` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `preview_text` VARCHAR(200) DEFAULT NULL COMMENT '预览文本',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话表';

-- 聊天消息表
CREATE TABLE IF NOT EXISTS `chat_message` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `session_id` BIGINT NOT NULL COMMENT '会话ID',
  `type` VARCHAR(20) NOT NULL COMMENT '消息类型(user/bot)',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `deep_thinking` TINYINT DEFAULT 0 COMMENT '是否深度思考',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记',
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';

-- 插入测试数据
INSERT INTO `job` (`title`, `company`, `city`, `salary_range`, `education_required`, `experience_required`, `job_type`, `industry`, `description`, `requirements`, `benefits`, `status`) VALUES
('Java后端开发工程师', '腾讯科技', '深圳', '15K-25K', '本科', '应届生', '校招', '互联网', 'Java后端开发，负责公司核心业务系统开发', '1. 计算机相关专业本科及以上学历\n2. 熟悉Java编程语言\n3. 了解Spring Boot框架', '五险一金、年终奖、带薪年假', 'active'),
('前端开发工程师', '阿里巴巴', '杭州', '12K-20K', '本科', '应届生', '校招', '互联网', '负责前端页面开发和优化', '1. 熟悉HTML/CSS/JavaScript\n2. 了解Vue或React框架\n3. 有良好的代码习惯', '六险一金、股票期权、免费三餐', 'active'),
('产品经理', '字节跳动', '北京', '18K-30K', '本科', '应届生', '校招', '互联网', '负责产品规划和需求分析', '1. 有产品思维和用户意识\n2. 良好的沟通能力\n3. 有实习经验优先', '五险一金、年终奖、弹性工作', 'active'),
('数据分析师', '美团', '北京', '10K-18K', '本科', '应届生', '校招', '互联网', '负责数据分析和报表制作', '1. 熟悉SQL和Excel\n2. 了解Python或R语言\n3. 有数据分析经验', '五险一金、餐补、交通补助', 'active'),
('UI设计师', '网易', '广州', '8K-15K', '本科', '应届生', '校招', '互联网', '负责产品界面设计', '1. 熟练使用Figma/Sketch\n2. 有良好的审美能力\n3. 有作品集', '五险一金、年终奖、下午茶', 'active');
