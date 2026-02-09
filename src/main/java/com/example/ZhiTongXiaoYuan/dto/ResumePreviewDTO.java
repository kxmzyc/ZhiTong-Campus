package com.example.zhitongxiaoyuan.dto;

import com.example.zhitongxiaoyuan.entity.*;
import lombok.Data;

import java.util.List;

/**
 * 简历预览 DTO
 * 包含简历的所有信息
 */
@Data
public class ResumePreviewDTO {

    // 基本信息
    private Resume resume;

    // 教育经历列表
    private List<ResumeEducation> educationList;

    // 实习经历列表
    private List<ResumeInternship> internshipList;

    // 项目经历列表
    private List<ResumeProject> projectList;

    // 获奖经历列表
    private List<ResumeAward> awardList;
}
