package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.dto.ResumePreviewDTO;
import com.example.zhitongxiaoyuan.entity.Resume;
import com.example.zhitongxiaoyuan.mapper.ResumeMapper;
import com.example.zhitongxiaoyuan.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 简历服务实现类
 */
@Service
public class ResumeServiceImpl extends ServiceImpl<ResumeMapper, Resume> implements ResumeService {

    @Autowired
    private ResumeEducationService educationService;

    @Autowired
    private ResumeInternshipService internshipService;

    @Autowired
    private ResumeProjectService projectService;

    @Autowired
    private ResumeAwardService awardService;

    @Override
    public List<Resume> getResumesByUserId(Long userId) {
        QueryWrapper<Resume> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.orderByDesc("updated_at");
        return list(wrapper);
    }

    @Override
    public Resume createResume(Resume resume) {
        save(resume);
        return resume;
    }

    @Override
    public Resume updateResume(Resume resume) {
        updateById(resume);
        return resume;
    }

    @Override
    public boolean deleteResume(Long id) {
        return removeById(id);
    }

    @Override
    public Resume getResumeDetail(Long id) {
        return getById(id);
    }

    @Override
    public ResumePreviewDTO getResumePreview(Long id) {
        // 获取简历基本信息
        Resume resume = getById(id);
        if (resume == null) {
            return null;
        }

        // 创建预览DTO
        ResumePreviewDTO previewDTO = new ResumePreviewDTO();
        previewDTO.setResume(resume);

        // 获取教育经历
        previewDTO.setEducationList(educationService.getByResumeId(id));

        // 获取实习经历
        previewDTO.setInternshipList(internshipService.getByResumeId(id));

        // 获取项目经历
        previewDTO.setProjectList(projectService.getByResumeId(id));

        // 获取获奖经历
        previewDTO.setAwardList(awardService.getByResumeId(id));

        return previewDTO;
    }
}
