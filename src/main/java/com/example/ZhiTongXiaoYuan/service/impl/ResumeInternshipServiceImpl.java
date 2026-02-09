package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.ResumeInternship;
import com.example.zhitongxiaoyuan.mapper.ResumeInternshipMapper;
import com.example.zhitongxiaoyuan.service.ResumeInternshipService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 实习经历服务实现类
 */
@Service
public class ResumeInternshipServiceImpl extends ServiceImpl<ResumeInternshipMapper, ResumeInternship> implements ResumeInternshipService {

    @Override
    public List<ResumeInternship> getByResumeId(Long resumeId) {
        QueryWrapper<ResumeInternship> wrapper = new QueryWrapper<>();
        wrapper.eq("resume_id", resumeId);
        wrapper.orderByDesc("start_date");
        return list(wrapper);
    }

    @Override
    public ResumeInternship createInternship(ResumeInternship internship) {
        save(internship);
        return internship;
    }

    @Override
    public ResumeInternship updateInternship(ResumeInternship internship) {
        updateById(internship);
        return internship;
    }

    @Override
    public boolean deleteInternship(Long id) {
        return removeById(id);
    }
}
