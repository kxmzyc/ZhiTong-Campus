package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.Job;

import java.util.List;

/**
 * 职位服务接口
 */
public interface JobService extends IService<Job> {

    /**
     * 动态搜索职位（支持关键词、城市、行业、职位类型筛选）
     * @param keyword 关键词（搜索标题和公司名）
     * @param city 城市
     * @param industry 行业
     * @param jobType 职位类型
     * @return 职位列表
     */
    List<Job> searchJobs(String keyword, String city, String industry, String jobType);
}
