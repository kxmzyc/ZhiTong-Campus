const { get, post, put, del } = require('./request');

/**
 * 测试接口
 */
function testHello() {
  return get('/hello');
}

/**
 * 获取职位列表（支持动态搜索）
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 关键词（可选）
 * @param {string} params.city - 城市（可选）
 * @param {string} params.industry - 行业（可选）
 * @param {string} params.jobType - 职位类型（可选）
 */
function getJobList(params) {
  return get('/job/list', params);
}

/**
 * 获取职位详情
 */
function getJobDetail(id) {
  return get(`/job/${id}`);
}

/**
 * 根据城市查询职位
 */
function getJobsByCity(city) {
  return get(`/job/city/${city}`);
}

/**
 * 根据行业查询职位
 */
function getJobsByIndustry(industry) {
  return get(`/job/industry/${industry}`);
}

/**
 * 根据职位类型查询
 */
function getJobsByType(jobType) {
  return get(`/job/type/${jobType}`);
}

// ==================== 简历相关接口 ====================

/**
 * 根据用户ID获取简历列表
 */
function getResumeList(userId) {
  return get(`/resume/list/${userId}`);
}

/**
 * 获取简历详情
 */
function getResumeDetail(id) {
  return get(`/resume/${id}`);
}

/**
 * 获取简历预览（包含所有子模块）
 */
function getResumePreview(id) {
  return get(`/resume/preview/${id}`);
}

/**
 * 创建简历
 */
function createResume(data) {
  return post('/resume', data);
}

/**
 * 更新简历
 */
function updateResume(data) {
  return put('/resume', data);
}

/**
 * 删除简历
 */
function deleteResume(id) {
  return del(`/resume/${id}`);
}

// ==================== 教育经历接口 ====================

/**
 * 获取教育经历列表
 */
function getEducationList(resumeId) {
  return get(`/resume/education/list/${resumeId}`);
}

/**
 * 创建教育经历
 */
function createEducation(data) {
  return post('/resume/education', data);
}

/**
 * 更新教育经历
 */
function updateEducation(data) {
  return put('/resume/education', data);
}

/**
 * 删除教育经历
 */
function deleteEducation(id) {
  return del(`/resume/education/${id}`);
}

// ==================== 实习经历接口 ====================

/**
 * 获取实习经历列表
 */
function getInternshipList(resumeId) {
  return get(`/resume/internship/list/${resumeId}`);
}

/**
 * 创建实习经历
 */
function createInternship(data) {
  return post('/resume/internship', data);
}

/**
 * 更新实习经历
 */
function updateInternship(data) {
  return put('/resume/internship', data);
}

/**
 * 删除实习经历
 */
function deleteInternship(id) {
  return del(`/resume/internship/${id}`);
}

// ==================== 项目经历接口 ====================

/**
 * 获取项目经历列表
 */
function getProjectList(resumeId) {
  return get(`/resume/project/list/${resumeId}`);
}

/**
 * 创建项目经历
 */
function createProject(data) {
  return post('/resume/project', data);
}

/**
 * 更新项目经历
 */
function updateProject(data) {
  return put('/resume/project', data);
}

/**
 * 删除项目经历
 */
function deleteProject(id) {
  return del(`/resume/project/${id}`);
}

// ==================== 获奖经历接口 ====================

/**
 * 获取获奖经历列表
 */
function getAwardList(resumeId) {
  return get(`/resume/award/list/${resumeId}`);
}

/**
 * 创建获奖经历
 */
function createAward(data) {
  return post('/resume/award', data);
}

/**
 * 更新获奖经历
 */
function updateAward(data) {
  return put('/resume/award', data);
}

/**
 * 删除获奖经历
 */
function deleteAward(id) {
  return del(`/resume/award/${id}`);
}

// ==================== 用户接口 ====================

/**
 * 根据ID获取用户信息
 */
function getUserById(id) {
  return get(`/user/${id}`);
}

/**
 * 根据openid获取用户信息
 */
function getUserByOpenid(openid) {
  return get(`/user/openid/${openid}`);
}

/**
 * 用户登录
 */
function userLogin(data) {
  return post('/user/login', data);
}

/**
 * 更新用户信息
 */
function updateUser(data) {
  return put('/user', data);
}

/**
 * 获取用户积分余额
 */
function getPointsBalance(userId) {
  return get(`/user/points/${userId}`);
}

/**
 * 增加积分
 */
function addPoints(userId, points) {
  return post('/user/points/add', { userId, points });
}

/**
 * 扣减积分
 */
function deductPoints(userId, points) {
  return post('/user/points/deduct', { userId, points });
}

// ==================== 职位申请接口 ====================

/**
 * 申请职位
 */
function applyJob(userId, jobId, resumeId) {
  return post('/application/apply', { userId, jobId, resumeId });
}

/**
 * 获取申请列表
 */
function getApplicationList(userId) {
  return get(`/application/list/${userId}`);
}

/**
 * 根据状态获取申请列表
 */
function getApplicationListByStatus(userId, status) {
  return get(`/application/list/${userId}/${status}`);
}

/**
 * 撤销申请
 */
function cancelApplication(id, userId) {
  return del(`/application/${id}?userId=${userId}`);
}

/**
 * 检查是否已申请
 */
function checkApplied(userId, jobId) {
  return get(`/application/check?userId=${userId}&jobId=${jobId}`);
}

/**
 * 获取申请详情
 */
function getApplicationDetail(id) {
  return get(`/application/${id}`);
}

// ==================== 收藏接口 ====================

/**
 * 添加收藏
 */
function addFavorite(userId, jobId) {
  return post('/favorite/add', { userId, jobId });
}

/**
 * 取消收藏
 */
function removeFavorite(userId, jobId) {
  return del(`/favorite/remove?userId=${userId}&jobId=${jobId}`);
}

/**
 * 获取收藏列表
 */
function getFavoriteList(userId) {
  return get(`/favorite/list/${userId}`);
}

/**
 * 检查是否已收藏
 */
function checkFavorited(userId, jobId) {
  return get(`/favorite/check?userId=${userId}&jobId=${jobId}`);
}

/**
 * 切换收藏状态
 */
function toggleFavorite(userId, jobId) {
  return post('/favorite/toggle', { userId, jobId });
}

module.exports = {
  testHello,
  getJobList,
  getJobDetail,
  getJobsByCity,
  getJobsByIndustry,
  getJobsByType,
  // 简历
  getResumeList,
  getResumeDetail,
  getResumePreview,
  createResume,
  updateResume,
  deleteResume,
  // 教育经历
  getEducationList,
  createEducation,
  updateEducation,
  deleteEducation,
  // 实习经历
  getInternshipList,
  createInternship,
  updateInternship,
  deleteInternship,
  // 项目经历
  getProjectList,
  createProject,
  updateProject,
  deleteProject,
  // 获奖经历
  getAwardList,
  createAward,
  updateAward,
  deleteAward,
  // 用户
  getUserById,
  getUserByOpenid,
  userLogin,
  updateUser,
  getPointsBalance,
  addPoints,
  deductPoints,
  // 职位申请
  applyJob,
  getApplicationList,
  getApplicationListByStatus,
  cancelApplication,
  checkApplied,
  getApplicationDetail,
  // 收藏
  addFavorite,
  removeFavorite,
  getFavoriteList,
  checkFavorited,
  toggleFavorite
};
