SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 职位表 (Job)
-- ----------------------------
DROP TABLE IF EXISTS `job`;
CREATE TABLE `job` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '职位ID',
  `company_id` BIGINT NOT NULL COMMENT '公司ID（关联company表）',
  `title` VARCHAR(100) NOT NULL COMMENT '职位名称',
  `salary_min` INT DEFAULT NULL COMMENT '最低薪资（单位：k）',
  `salary_max` INT DEFAULT NULL COMMENT '最高薪资（单位：k）',
  `education` VARCHAR(50) DEFAULT NULL COMMENT '学历要求',
  `experience` VARCHAR(50) DEFAULT NULL COMMENT '经验要求',
  `tags` VARCHAR(500) DEFAULT NULL COMMENT '技能标签（JSON数组字符串）',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '工作城市',
  `description` TEXT DEFAULT NULL COMMENT '职位描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_city` (`city`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职位表';

-- ----------------------------
-- 种子数据：10条真实招聘职位
-- ----------------------------

-- 阿里巴巴 (company_id = 101) 的职位
INSERT INTO `job` (`company_id`, `title`, `salary_min`, `salary_max`, `education`, `experience`, `tags`, `city`, `description`) VALUES
(101, 'Java高级开发工程师', 30, 60, '本科', '3-5年', '["Java","Spring Boot","微服务","MySQL","Redis"]', '杭州', '负责淘宝核心交易系统的开发与维护，参与高并发场景的架构设计与优化。'),
(101, '前端开发工程师（React方向）', 25, 50, '本科', '3-5年', '["React","TypeScript","Webpack","Node.js"]', '杭州', '负责阿里云控制台前端开发，参与组件库建设和性能优化。'),
(101, '算法工程师（推荐系统）', 35, 70, '硕士', '3-5年', '["机器学习","推荐算法","Python","TensorFlow"]', '杭州', '负责淘宝推荐系统的算法研发，优化用户体验和转化率。');

-- 腾讯 (company_id = 102) 的职位
INSERT INTO `job` (`company_id`, `title`, `salary_min`, `salary_max`, `education`, `experience`, `tags`, `city`, `description`) VALUES
(102, '后端开发工程师（微信方向）', 30, 60, '本科', '3-5年', '["C++","Go","分布式系统","高并发"]', '深圳', '负责微信后台服务开发，处理海量用户请求，保障系统稳定性。'),
(102, '游戏客户端开发工程师', 25, 50, '本科', '3-5年', '["Unity3D","C#","Lua","性能优化"]', '深圳', '负责腾讯游戏客户端开发，实现游戏玩法和优化游戏性能。'),
(102, '云计算架构师', 40, 80, '本科', '5-10年', '["Kubernetes","Docker","云原生","架构设计"]', '深圳', '负责腾讯云产品架构设计，推动云原生技术落地。');

-- 字节跳动 (company_id = 103) 的职位
INSERT INTO `job` (`company_id`, `title`, `salary_min`, `salary_max`, `education`, `experience`, `tags`, `city`, `description`) VALUES
(103, '前端开发工程师（抖音）', 25, 50, '本科', '1-3年', '["Vue.js","React","TypeScript","小程序"]', '北京', '负责抖音前端业务开发，优化用户体验，参与技术创新。'),
(103, '推荐算法工程师', 35, 70, '硕士', '3-5年', '["深度学习","推荐系统","Python","PyTorch"]', '北京', '负责抖音推荐算法优化，提升内容分发效率和用户留存。'),
(103, '后端开发工程师（基础架构）', 30, 60, '本科', '3-5年', '["Go","分布式","微服务","Kubernetes"]', '北京', '负责字节跳动基础架构建设，支撑海量业务增长。');

-- 网易 (company_id = 201) 的职位
INSERT INTO `job` (`company_id`, `title`, `salary_min`, `salary_max`, `education`, `experience`, `tags`, `city`, `description`) VALUES
(201, '游戏开发工程师（Unity）', 20, 40, '本科', '1-3年', '["Unity3D","C#","游戏逻辑","Shader"]', '杭州', '负责网易游戏客户端开发，实现游戏玩法和特效。');

SET FOREIGN_KEY_CHECKS = 1;
