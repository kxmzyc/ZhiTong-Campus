package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.ResumeProject;
import com.example.zhitongxiaoyuan.mapper.ResumeProjectMapper;
import com.example.zhitongxiaoyuan.service.ResumeProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 项目经历服务实现类
 */
@Service
public class ResumeProjectServiceImpl extends ServiceImpl<ResumeProjectMapper, ResumeProject> implements ResumeProjectService {

    @Override
    public List<ResumeProject> getByResumeId(Long resumeId) {
        QueryWrapper<ResumeProject> wrapper = new QueryWrapper<>();
        wrapper.eq("resume_id", resumeId);
        wrapper.orderByDesc("start_date");
        return list(wrapper);
    }

    @Override
    public ResumeProject createProject(ResumeProject project) {
        save(project);
        return project;
    }

    @Override
    public ResumeProject updateProject(ResumeProject project) {
        updateById(project);
        return project;
    }

    @Override
    public boolean deleteProject(Long id) {
        return removeById(id);
    }
}
