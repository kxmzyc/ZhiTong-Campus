package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.ResumeEducation;

import java.util.List;

/**
 * 教育经历服务接口
 */
public interface ResumeEducationService extends IService<ResumeEducation> {

    /**
     * 根据简历ID获取教育经历列表
     */
    List<ResumeEducation> getByResumeId(Long resumeId);

    /**
     * 创建教育经历
     */
    ResumeEducation createEducation(ResumeEducation education);

    /**
     * 更新教育经历
     */
    ResumeEducation updateEducation(ResumeEducation education);

    /**
     * 删除教育经历
     */
    boolean deleteEducation(Long id);
}
