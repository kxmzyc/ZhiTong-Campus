package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.ResumeAward;
import com.example.zhitongxiaoyuan.service.ResumeAwardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 获奖经历控制器
 */
@RestController
@RequestMapping("/api/resume/award")
public class ResumeAwardController {

    @Autowired
    private ResumeAwardService awardService;

    /**
     * 根据简历ID获取获奖经历列表
     */
    @GetMapping("/list/{resumeId}")
    public Result<List<ResumeAward>> getByResumeId(@PathVariable Long resumeId) {
        List<ResumeAward> list = awardService.getByResumeId(resumeId);
        return Result.success(list);
    }

    /**
     * 创建获奖经历
     */
    @PostMapping
    public Result<ResumeAward> create(@RequestBody ResumeAward award) {
        ResumeAward created = awardService.createAward(award);
        return Result.success("创建成功", created);
    }

    /**
     * 更新获奖经历
     */
    @PutMapping
    public Result<ResumeAward> update(@RequestBody ResumeAward award) {
        if (award.getId() == null) {
            return Result.error("ID不能为空");
        }
        ResumeAward updated = awardService.updateAward(award);
        return Result.success("更新成功", updated);
    }

    /**
     * 删除获奖经历
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean success = awardService.deleteAward(id);
        if (success) {
            return Result.success("删除成功", null);
        } else {
            return Result.error("删除失败");
        }
    }
}
