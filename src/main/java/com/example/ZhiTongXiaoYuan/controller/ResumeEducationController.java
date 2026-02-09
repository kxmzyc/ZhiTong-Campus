package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.ResumeEducation;
import com.example.zhitongxiaoyuan.service.ResumeEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 教育经历控制器
 */
@RestController
@RequestMapping("/api/resume/education")
public class ResumeEducationController {

    @Autowired
    private ResumeEducationService educationService;

    /**
     * 根据简历ID获取教育经历列表
     */
    @GetMapping("/list/{resumeId}")
    public Result<List<ResumeEducation>> getByResumeId(@PathVariable Long resumeId) {
        List<ResumeEducation> list = educationService.getByResumeId(resumeId);
        return Result.success(list);
    }

    /**
     * 创建教育经历
     */
    @PostMapping
    public Result<ResumeEducation> create(@RequestBody ResumeEducation education) {
        ResumeEducation created = educationService.createEducation(education);
        return Result.success("创建成功", created);
    }

    /**
     * 更新教育经历
     */
    @PutMapping
    public Result<ResumeEducation> update(@RequestBody ResumeEducation education) {
        if (education.getId() == null) {
            return Result.error("ID不能为空");
        }
        ResumeEducation updated = educationService.updateEducation(education);
        return Result.success("更新成功", updated);
    }

    /**
     * 删除教育经历
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean success = educationService.deleteEducation(id);
        if (success) {
            return Result.success("删除成功", null);
        } else {
            return Result.error("删除失败");
        }
    }
}
