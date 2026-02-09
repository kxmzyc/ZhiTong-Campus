package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.ResumeInternship;
import com.example.zhitongxiaoyuan.service.ResumeInternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 实习经历控制器
 */
@RestController
@RequestMapping("/api/resume/internship")
public class ResumeInternshipController {

    @Autowired
    private ResumeInternshipService internshipService;

    /**
     * 根据简历ID获取实习经历列表
     */
    @GetMapping("/list/{resumeId}")
    public Result<List<ResumeInternship>> getByResumeId(@PathVariable Long resumeId) {
        List<ResumeInternship> list = internshipService.getByResumeId(resumeId);
        return Result.success(list);
    }

    /**
     * 创建实习经历
     */
    @PostMapping
    public Result<ResumeInternship> create(@RequestBody ResumeInternship internship) {
        ResumeInternship created = internshipService.createInternship(internship);
        return Result.success("创建成功", created);
    }

    /**
     * 更新实习经历
     */
    @PutMapping
    public Result<ResumeInternship> update(@RequestBody ResumeInternship internship) {
        if (internship.getId() == null) {
            return Result.error("ID不能为空");
        }
        ResumeInternship updated = internshipService.updateInternship(internship);
        return Result.success("更新成功", updated);
    }

    /**
     * 删除实习经历
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean success = internshipService.deleteInternship(id);
        if (success) {
            return Result.success("删除成功", null);
        } else {
            return Result.error("删除失败");
        }
    }
}
