package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.ResumeEducation;
import com.example.zhitongxiaoyuan.mapper.ResumeEducationMapper;
import com.example.zhitongxiaoyuan.service.ResumeEducationService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 教育经历服务实现类
 */
@Service
public class ResumeEducationServiceImpl extends ServiceImpl<ResumeEducationMapper, ResumeEducation> implements ResumeEducationService {

    @Override
    public List<ResumeEducation> getByResumeId(Long resumeId) {
        QueryWrapper<ResumeEducation> wrapper = new QueryWrapper<>();
        wrapper.eq("resume_id", resumeId);
        wrapper.orderByDesc("start_date");
        return list(wrapper);
    }

    @Override
    public ResumeEducation createEducation(ResumeEducation education) {
        save(education);
        return education;
    }

    @Override
    public ResumeEducation updateEducation(ResumeEducation education) {
        updateById(education);
        return education;
    }

    @Override
    public boolean deleteEducation(Long id) {
        return removeById(id);
    }
}
