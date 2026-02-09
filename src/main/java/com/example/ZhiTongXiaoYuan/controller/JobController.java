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
     * 获取所有职位列表
     */
    @GetMapping("/list")
    public Result<List<Job>> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
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

    /**
     * 根据城市查询职位
     */
    @GetMapping("/city/{city}")
    public Result<List<Job>> getJobsByCity(@PathVariable String city) {
        List<Job> jobs = jobService.getJobsByCity(city);
        return Result.success(jobs);
    }

    /**
     * 根据行业查询职位
     */
    @GetMapping("/industry/{industry}")
    public Result<List<Job>> getJobsByIndustry(@PathVariable String industry) {
        List<Job> jobs = jobService.getJobsByIndustry(industry);
        return Result.success(jobs);
    }

    /**
     * 根据职位类型查询
     */
    @GetMapping("/type/{jobType}")
    public Result<List<Job>> getJobsByType(@PathVariable String jobType) {
        List<Job> jobs = jobService.getJobsByType(jobType);
        return Result.success(jobs);
    }
}
