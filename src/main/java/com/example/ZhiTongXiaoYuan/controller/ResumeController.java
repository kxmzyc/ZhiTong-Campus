package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.dto.ResumePreviewDTO;
import com.example.zhitongxiaoyuan.entity.Resume;
import com.example.zhitongxiaoyuan.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 简历控制器
 */
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    /**
     * 根据用户ID获取简历列表
     */
    @GetMapping("/list/{userId}")
    public Result<List<Resume>> getResumesByUserId(@PathVariable Long userId) {
        List<Resume> resumes = resumeService.getResumesByUserId(userId);
        return Result.success(resumes);
    }

    /**
     * 获取简历详情
     */
    @GetMapping("/{id}")
    public Result<Resume> getResumeDetail(@PathVariable Long id) {
        Resume resume = resumeService.getResumeDetail(id);
        if (resume == null) {
            return Result.error("简历不存在");
        }
        return Result.success(resume);
    }

    /**
     * 获取简历预览（包含所有子模块）
     */
    @GetMapping("/preview/{id}")
    public Result<ResumePreviewDTO> getResumePreview(@PathVariable Long id) {
        ResumePreviewDTO preview = resumeService.getResumePreview(id);
        if (preview == null) {
            return Result.error("简历不存在");
        }
        return Result.success(preview);
    }

    /**
     * 创建简历
     */
    @PostMapping
    public Result<Resume> createResume(@RequestBody Resume resume) {
        Resume created = resumeService.createResume(resume);
        return Result.success("创建成功", created);
    }

    /**
     * 更新简历
     */
    @PutMapping
    public Result<Resume> updateResume(@RequestBody Resume resume) {
        if (resume.getId() == null) {
            return Result.error("简历ID不能为空");
        }
        Resume updated = resumeService.updateResume(resume);
        return Result.success("更新成功", updated);
    }

    /**
     * 删除简历
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteResume(@PathVariable Long id) {
        boolean success = resumeService.deleteResume(id);
        if (success) {
            return Result.success("删除成功", null);
        } else {
            return Result.error("删除失败");
        }
    }
}
