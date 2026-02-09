package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.Job;

import java.util.List;

/**
 * 职位服务接口
 */
public interface JobService extends IService<Job> {

    /**
     * 获取所有职位列表
     */
    List<Job> getAllJobs();

    /**
     * 根据城市查询职位
     */
    List<Job> getJobsByCity(String city);

    /**
     * 根据行业查询职位
     */
    List<Job> getJobsByIndustry(String industry);

    /**
     * 根据职位类型查询
     */
    List<Job> getJobsByType(String jobType);
}
