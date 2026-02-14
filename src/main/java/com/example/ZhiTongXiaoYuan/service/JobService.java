package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.Job;

import java.util.List;

/**
 * 职位服务接口
 */
public interface JobService extends IService<Job> {

    /**
     * 根据公司ID获取职位列表
     * @param companyId 公司ID
     * @return 职位列表
     */
    List<Job> getJobsByCompanyId(Long companyId);

    /**
     * 获取所有职位列表
     * @return 职位列表
     */
    List<Job> getAllJobs();

    /**
     * 根据ID获取职位详情
     * @param id 职位ID
     * @return 职位详情
     */
    Job getJobById(Long id);
}
