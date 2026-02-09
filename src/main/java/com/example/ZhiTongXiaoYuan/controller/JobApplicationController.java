package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.JobApplication;
import com.example.zhitongxiaoyuan.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 职位申请控制器
 */
@RestController
@RequestMapping("/api/application")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    /**
     * 申请职位
     */
    @PostMapping("/apply")
    public Result<JobApplication> applyJob(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long jobId = Long.valueOf(params.get("jobId").toString());
        Long resumeId = params.get("resumeId") != null ? Long.valueOf(params.get("resumeId").toString()) : null;

        try {
            JobApplication application = applicationService.applyJob(userId, jobId, resumeId);
            return Result.success("申请成功", application);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 获取用户的申请列表
     */
    @GetMapping("/list/{userId}")
    public Result<List<JobApplication>> getApplicationsByUserId(@PathVariable Long userId) {
        List<JobApplication> applications = applicationService.getApplicationsByUserId(userId);
        return Result.success(applications);
    }

    /**
     * 根据状态获取申请列表
     */
    @GetMapping("/list/{userId}/{status}")
    public Result<List<JobApplication>> getApplicationsByStatus(
            @PathVariable Long userId,
            @PathVariable String status) {
        List<JobApplication> applications = applicationService.getApplicationsByUserIdAndStatus(userId, status);
        return Result.success(applications);
    }

    /**
     * 撤销申请
     */
    @DeleteMapping("/{id}")
    public Result<Void> cancelApplication(@PathVariable Long id, @RequestParam Long userId) {
        try {
            boolean success = applicationService.cancelApplication(id, userId);
            if (success) {
                return Result.success("撤销成功", null);
            } else {
                return Result.error("撤销失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 检查是否已申请
     */
    @GetMapping("/check")
    public Result<Map<String, Boolean>> checkApplied(@RequestParam Long userId, @RequestParam Long jobId) {
        boolean hasApplied = applicationService.hasApplied(userId, jobId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("hasApplied", hasApplied);
        return Result.success(result);
    }

    /**
     * 获取申请详情
     */
    @GetMapping("/{id}")
    public Result<JobApplication> getApplicationDetail(@PathVariable Long id) {
        JobApplication application = applicationService.getApplicationDetail(id);
        if (application == null) {
            return Result.error("申请不存在");
        }
        return Result.success(application);
    }
}
