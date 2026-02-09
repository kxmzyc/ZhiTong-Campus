package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.ResumeAward;
import com.example.zhitongxiaoyuan.mapper.ResumeAwardMapper;
import com.example.zhitongxiaoyuan.service.ResumeAwardService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 获奖经历服务实现类
 */
@Service
public class ResumeAwardServiceImpl extends ServiceImpl<ResumeAwardMapper, ResumeAward> implements ResumeAwardService {

    @Override
    public List<ResumeAward> getByResumeId(Long resumeId) {
        QueryWrapper<ResumeAward> wrapper = new QueryWrapper<>();
        wrapper.eq("resume_id", resumeId);
        wrapper.orderByDesc("award_date");
        return list(wrapper);
    }

    @Override
    public ResumeAward createAward(ResumeAward award) {
        save(award);
        return award;
    }

    @Override
    public ResumeAward updateAward(ResumeAward award) {
        updateById(award);
        return award;
    }

    @Override
    public boolean deleteAward(Long id) {
        return removeById(id);
    }
}
