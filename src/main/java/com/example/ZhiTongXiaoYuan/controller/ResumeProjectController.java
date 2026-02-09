package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.ResumeProject;
import com.example.zhitongxiaoyuan.service.ResumeProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 项目经历控制器
 */
@RestController
@RequestMapping("/api/resume/project")
public class ResumeProjectController {

    @Autowired
    private ResumeProjectService projectService;

    /**
     * 根据简历ID获取项目经历列表
     */
    @GetMapping("/list/{resumeId}")
    public Result<List<ResumeProject>> getByResumeId(@PathVariable Long resumeId) {
        List<ResumeProject> list = projectService.getByResumeId(resumeId);
        return Result.success(list);
    }

    /**
     * 创建项目经历
     */
    @PostMapping
    public Result<ResumeProject> create(@RequestBody ResumeProject project) {
        ResumeProject created = projectService.createProject(project);
        return Result.success("创建成功", created);
    }

    /**
     * 更新项目经历
     */
    @PutMapping
    public Result<ResumeProject> update(@RequestBody ResumeProject project) {
        if (project.getId() == null) {
            return Result.error("ID不能为空");
        }
        ResumeProject updated = projectService.updateProject(project);
        return Result.success("更新成功", updated);
    }

    /**
     * 删除项目经历
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean success = projectService.deleteProject(id);
        if (success) {
            return Result.success("删除成功", null);
        } else {
            return Result.error("删除失败");
        }
    }
}
