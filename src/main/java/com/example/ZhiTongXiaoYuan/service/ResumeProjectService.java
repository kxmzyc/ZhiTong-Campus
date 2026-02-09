package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.ResumeProject;

import java.util.List;

/**
 * 项目经历服务接口
 */
public interface ResumeProjectService extends IService<ResumeProject> {

    /**
     * 根据简历ID获取项目经历列表
     */
    List<ResumeProject> getByResumeId(Long resumeId);

    /**
     * 创建项目经历
     */
    ResumeProject createProject(ResumeProject project);

    /**
     * 更新项目经历
     */
    ResumeProject updateProject(ResumeProject project);

    /**
     * 删除项目经历
     */
    boolean deleteProject(Long id);
}
