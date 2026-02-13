package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.Job;
import com.example.zhitongxiaoyuan.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 职位控制器
 */
@RestController
@RequestMapping("/api/job")
public class JobController {

    @Autowired
    private JobService jobService;

    /**
     * 动态搜索职位列表（支持关键词、城市、行业、职位类型筛选）
     * @param keyword 关键词（可选）
     * @param city 城市（可选）
     * @param industry 行业（可选）
     * @param jobType 职位类型（可选）
     * @return 职位列表
     */
    @GetMapping("/list")
    public Result<List<Job>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String jobType) {
        List<Job> jobs = jobService.searchJobs(keyword, city, industry, jobType);
        return Result.success(jobs);
    }

    /**
     * 根据ID获取职位详情
     */
    @GetMapping("/{id}")
    public Result<Job> getJobById(@PathVariable Long id) {
        Job job = jobService.getById(id);
        if (job == null) {
            return Result.error("职位不存在");
        }
        return Result.success(job);
    }

    // ========== 以下接口已废弃，保留用于兼容性 ==========

    /**
     * @deprecated 请使用 /list 接口，传递 city 参数
     */
    @Deprecated
    @GetMapping("/city/{city}")
    public Result<List<Job>> getJobsByCity(@PathVariable String city) {
        List<Job> jobs = jobService.searchJobs(null, city, null, null);
        return Result.success(jobs);
    }

    /**
     * @deprecated 请使用 /list 接口，传递 industry 参数
     */
    @Deprecated
    @GetMapping("/industry/{industry}")
    public Result<List<Job>> getJobsByIndustry(@PathVariable String industry) {
        List<Job> jobs = jobService.searchJobs(null, null, industry, null);
        return Result.success(jobs);
    }

    /**
     * @deprecated 请使用 /list 接口，传递 jobType 参数
     */
    @Deprecated
    @GetMapping("/type/{jobType}")
    public Result<List<Job>> getJobsByType(@PathVariable String jobType) {
        List<Job> jobs = jobService.searchJobs(null, null, null, jobType);
        return Result.success(jobs);
    }
}
