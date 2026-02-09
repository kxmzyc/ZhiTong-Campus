/**
 * 简历数据同步服务
 * 负责将本地存储的简历数据同步到后端
 */

const api = require('./api');

/**
 * 从本地存储获取简历ID对应的后端ID
 */
function getBackendResumeId(localResumeId) {
  if (!localResumeId) return null;

  // 从 r_1 格式提取数字部分
  const match = String(localResumeId).match(/^r_(\d+)$/);
  if (match) {
    return parseInt(match[1]);
  }

  // 如果已经是数字，直接返回
  const num = parseInt(localResumeId);
  return isNaN(num) ? null : num;
}

/**
 * 同步基本信息到后端
 */
function syncBasicInfo(localResumeId) {
  const backendId = getBackendResumeId(localResumeId);
  if (!backendId) {
    console.log('无效的简历ID，跳过同步');
    return Promise.resolve();
  }

  // 读取本地存储的基本信息
  const basicInfo = wx.getStorageSync('profile_basic_info') || {};

  // 构建后端需要的数据格式
  const resumeData = {
    id: backendId,
    userId: 1, // TODO: 从登录信息获取真实用户ID
    name: basicInfo.name || '',
    gender: basicInfo.gender || '',
    phone: basicInfo.phone || '',
    email: basicInfo.email || '',
    education: basicInfo.degree || '',
    school: basicInfo.school || '',
    major: basicInfo.major || '',
    graduationDate: formatGraduationDate(basicInfo.gradYear, basicInfo.gradMonth),
    jobIntention: (basicInfo.intendedPositions || []).join('、'),
    expectedCity: (basicInfo.intendedCities || []).join('、'),
    expectedSalary: basicInfo.expectedSalary || ''
  };

  // 调用更新接口
  return api.updateResume(resumeData)
    .then(res => {
      console.log('基本信息同步成功', res);
      return res;
    })
    .catch(err => {
      console.error('基本信息同步失败', err);
      throw err;
    });
}

/**
 * 同步教育经历到后端
 */
function syncEducation(localResumeId) {
  const backendId = getBackendResumeId(localResumeId);
  if (!backendId) return Promise.resolve();

  const key = `resume_education_${localResumeId}`;
  const eduData = wx.getStorageSync(key) || {};

  if (!eduData.school || !eduData.school.name) {
    console.log('教育经历为空，跳过同步');
    return Promise.resolve();
  }

  const educationData = {
    resumeId: backendId,
    school: eduData.school.name || '',
    major: eduData.majorName || '',
    education: (eduData.degree && eduData.degree.name) || '',
    startDate: formatDate(eduData.startYear, eduData.startMonth),
    endDate: formatDate(eduData.endYear, eduData.endMonth),
    description: eduData.description || ''
  };

  // 检查是否已存在
  return api.getEducationList(backendId)
    .then(res => {
      const list = (res.data && res.data.data) || res.data || [];
      if (list.length > 0) {
        // 更新第一条记录
        educationData.id = list[0].id;
        return api.updateEducation(educationData);
      } else {
        // 创建新记录
        return api.createEducation(educationData);
      }
    })
    .then(res => {
      console.log('教育经历同步成功', res);
      return res;
    })
    .catch(err => {
      console.error('教育经历同步失败', err);
      throw err;
    });
}

/**
 * 同步实习经历到后端
 */
function syncInternship(localResumeId) {
  const backendId = getBackendResumeId(localResumeId);
  if (!backendId) return Promise.resolve();

  const key = `resume_internship_${localResumeId}`;
  const internData = wx.getStorageSync(key) || {};

  if (!internData.companyName) {
    console.log('实习经历为空，跳过同步');
    return Promise.resolve();
  }

  const internshipData = {
    resumeId: backendId,
    company: internData.companyName || '',
    position: internData.positionName || '',
    startDate: formatDate(internData.startYear, internData.startMonth),
    endDate: formatDate(internData.endYear, internData.endMonth),
    description: internData.description || ''
  };

  return api.getInternshipList(backendId)
    .then(res => {
      const list = (res.data && res.data.data) || res.data || [];
      if (list.length > 0) {
        internshipData.id = list[0].id;
        return api.updateInternship(internshipData);
      } else {
        return api.createInternship(internshipData);
      }
    })
    .then(res => {
      console.log('实习经历同步成功', res);
      return res;
    })
    .catch(err => {
      console.error('实习经历同步失败', err);
      throw err;
    });
}

/**
 * 同步项目经历到后端
 */
function syncProject(localResumeId) {
  const backendId = getBackendResumeId(localResumeId);
  if (!backendId) return Promise.resolve();

  const key = `resume_project_${localResumeId}`;
  const projectData = wx.getStorageSync(key) || {};

  if (!projectData.projectName) {
    console.log('项目经历为空，跳过同步');
    return Promise.resolve();
  }

  const data = {
    resumeId: backendId,
    name: projectData.projectName || '',
    role: projectData.roleName || '',
    startDate: formatDate(projectData.startYear, projectData.startMonth),
    endDate: formatDate(projectData.endYear, projectData.endMonth),
    description: projectData.description || ''
  };

  return api.getProjectList(backendId)
    .then(res => {
      const list = (res.data && res.data.data) || res.data || [];
      if (list.length > 0) {
        data.id = list[0].id;
        return api.updateProject(data);
      } else {
        return api.createProject(data);
      }
    })
    .then(res => {
      console.log('项目经历同步成功', res);
      return res;
    })
    .catch(err => {
      console.error('项目经历同步失败', err);
      throw err;
    });
}

/**
 * 同步获奖经历到后端
 */
function syncAwards(localResumeId) {
  const backendId = getBackendResumeId(localResumeId);
  if (!backendId) return Promise.resolve();

  const key = `resume_awards_${localResumeId}`;
  const awardData = wx.getStorageSync(key) || {};

  if (!awardData.awardName) {
    console.log('获奖经历为空，跳过同步');
    return Promise.resolve();
  }

  const data = {
    resumeId: backendId,
    name: awardData.awardName || '',
    level: awardData.awardLevel || '',
    awardDate: formatDate(awardData.awardYear, awardData.awardMonth),
    description: awardData.description || ''
  };

  return api.getAwardList(backendId)
    .then(res => {
      const list = (res.data && res.data.data) || res.data || [];
      if (list.length > 0) {
        data.id = list[0].id;
        return api.updateAward(data);
      } else {
        return api.createAward(data);
      }
    })
    .then(res => {
      console.log('获奖经历同步成功', res);
      return res;
    })
    .catch(err => {
      console.error('获奖经历同步失败', err);
      throw err;
    });
}

/**
 * 同步技能和自我评价到后端
 */
function syncSkillsAndSummary(localResumeId) {
  const backendId = getBackendResumeId(localResumeId);
  if (!backendId) return Promise.resolve();

  const skillsKey = `resume_skills_${localResumeId}`;
  const summaryKey = `resume_summary_${localResumeId}`;

  const skillsData = wx.getStorageSync(skillsKey) || {};
  const summaryData = wx.getStorageSync(summaryKey) || {};

  // 构建技能文本
  const skillsParts = [];
  if (skillsData.langSkill) skillsParts.push(skillsData.langSkill);
  if (skillsData.techSkill) skillsParts.push(skillsData.techSkill);
  if (skillsData.traitSkill) skillsParts.push(skillsData.traitSkill);
  if (skillsData.hobbySkill) skillsParts.push(skillsData.hobbySkill);

  const updateData = {
    id: backendId,
    skills: skillsParts.join('\n'),
    selfEvaluation: summaryData.description || ''
  };

  return api.updateResume(updateData)
    .then(res => {
      console.log('技能和自我评价同步成功', res);
      return res;
    })
    .catch(err => {
      console.error('技能和自我评价同步失败', err);
      throw err;
    });
}

/**
 * 同步所有简历数据到后端
 */
function syncAllResumeData(localResumeId) {
  console.log('开始同步简历数据到后端...', localResumeId);

  return Promise.all([
    syncBasicInfo(localResumeId),
    syncEducation(localResumeId),
    syncInternship(localResumeId),
    syncProject(localResumeId),
    syncAwards(localResumeId),
    syncSkillsAndSummary(localResumeId)
  ])
  .then(results => {
    console.log('简历数据同步完成', results);
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
    return results;
  })
  .catch(err => {
    console.error('简历数据同步失败', err);
    wx.showToast({
      title: '保存失败，请重试',
      icon: 'none',
      duration: 2000
    });
    throw err;
  });
}

/**
 * 格式化日期
 */
function formatDate(year, month) {
  if (!year) return null;
  const y = String(year).padStart(4, '0');
  const m = String(month || '01').padStart(2, '0');
  return `${y}-${m}-01`;
}

/**
 * 格式化毕业日期
 */
function formatGraduationDate(year, month) {
  if (!year) return null;
  const y = String(year).padStart(4, '0');
  const m = String(month || '06').padStart(2, '0');
  return `${y}-${m}-30`;
}

module.exports = {
  getBackendResumeId,
  syncBasicInfo,
  syncEducation,
  syncInternship,
  syncProject,
  syncAwards,
  syncSkillsAndSummary,
  syncAllResumeData
};
