package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.Job;
import com.example.zhitongxiaoyuan.mapper.JobMapper;
import com.example.zhitongxiaoyuan.service.JobService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 职位服务实现类
 */
@Service
public class JobServiceImpl extends ServiceImpl<JobMapper, Job> implements JobService {

    @Override
    public List<Job> getAllJobs() {
        QueryWrapper<Job> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "active");
        wrapper.orderByDesc("created_at");
        return list(wrapper);
    }

    @Override
    public List<Job> getJobsByCity(String city) {
        QueryWrapper<Job> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "active");
        wrapper.eq("city", city);
        wrapper.orderByDesc("created_at");
        return list(wrapper);
    }

    @Override
    public List<Job> getJobsByIndustry(String industry) {
        QueryWrapper<Job> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "active");
        wrapper.eq("industry", industry);
        wrapper.orderByDesc("created_at");
        return list(wrapper);
    }

    @Override
    public List<Job> getJobsByType(String jobType) {
        QueryWrapper<Job> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "active");
        wrapper.eq("job_type", jobType);
        wrapper.orderByDesc("created_at");
        return list(wrapper);
    }
}
