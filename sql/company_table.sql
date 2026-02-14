-- =============================================
-- 公司表 (company) 建表语句
-- =============================================

CREATE TABLE `company` (
  `id` BIGINT NOT NULL COMMENT '公司ID（手动指定，与前端路由匹配）',
  `name` VARCHAR(100) NOT NULL COMMENT '公司名称',
  `logo` VARCHAR(500) DEFAULT NULL COMMENT 'Logo URL',
  `tags` VARCHAR(500) DEFAULT NULL COMMENT '标签（JSON数组字符串，如：["互联网","电商","云计算"]）',
  `industry` VARCHAR(50) DEFAULT NULL COMMENT '行业',
  `location` VARCHAR(50) DEFAULT NULL COMMENT '城市/地点',
  `description` TEXT COMMENT '公司简介',
  `job_count` INT DEFAULT 0 COMMENT '在招职位数',
  `scale` VARCHAR(50) DEFAULT NULL COMMENT '公司规模（如：10000人以上）',
  `financing_status` VARCHAR(50) DEFAULT NULL COMMENT '融资状态（如：已上市）',
  `introduction` TEXT COMMENT '公司详细介绍（用于详情页）',
  `business_info` TEXT COMMENT '工商信息（JSON字符串）',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除标记（0-未删除，1-已删除）',
  PRIMARY KEY (`id`),
  KEY `idx_industry` (`industry`),
  KEY `idx_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公司信息表';
