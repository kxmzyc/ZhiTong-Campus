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
     * 获取职位列表（支持公司ID筛选）
     * @param companyId 公司ID（可选）
     * @return 职位列表
     */
    @GetMapping("/list")
    public Result<List<Job>> list(@RequestParam(required = false) Long companyId) {
        List<Job> jobs;

        // 如果指定了公司ID，则按公司筛选
        if (companyId != null) {
            jobs = jobService.getJobsByCompanyId(companyId);
        } else {
            // 否则返回所有职位
            jobs = jobService.getAllJobs();
        }

        return Result.success(jobs);
    }

    /**
     * 根据ID获取职位详情
     * @param id 职位ID
     * @return 职位详情
     */
    @GetMapping("/detail/{id}")
    public Result<Job> getDetail(@PathVariable Long id) {
        Job job = jobService.getJobById(id);

        if (job == null) {
            return Result.error("职位不存在");
        }

        return Result.success(job);
    }
}
