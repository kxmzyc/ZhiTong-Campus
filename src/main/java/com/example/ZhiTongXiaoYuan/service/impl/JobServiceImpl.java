package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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

    /**
     * 根据公司ID获取职位列表
     * @param companyId 公司ID
     * @return 职位列表
     */
    @Override
    public List<Job> getJobsByCompanyId(Long companyId) {
        LambdaQueryWrapper<Job> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Job::getCompanyId, companyId);
        queryWrapper.orderByDesc(Job::getCreatedAt); // 按创建时间降序排列
        return this.list(queryWrapper);
    }

    /**
     * 获取所有职位列表
     * @return 职位列表
     */
    @Override
    public List<Job> getAllJobs() {
        LambdaQueryWrapper<Job> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(Job::getCreatedAt); // 按创建时间降序排列
        return this.list(queryWrapper);
    }

    /**
     * 根据ID获取职位详情
     * @param id 职位ID
     * @return 职位详情
     */
    @Override
    public Job getJobById(Long id) {
        return this.getById(id);
    }
}
