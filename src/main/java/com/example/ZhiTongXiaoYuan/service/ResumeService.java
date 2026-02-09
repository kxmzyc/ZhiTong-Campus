package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.dto.ResumePreviewDTO;
import com.example.zhitongxiaoyuan.entity.Resume;

import java.util.List;

/**
 * 简历服务接口
 */
public interface ResumeService extends IService<Resume> {

    /**
     * 根据用户ID获取简历列表
     */
    List<Resume> getResumesByUserId(Long userId);

    /**
     * 创建简历
     */
    Resume createResume(Resume resume);

    /**
     * 更新简历
     */
    Resume updateResume(Resume resume);

    /**
     * 删除简历
     */
    boolean deleteResume(Long id);

    /**
     * 获取简历详情
     */
    Resume getResumeDetail(Long id);

    /**
     * 获取简历预览（包含所有子模块）
     */
    ResumePreviewDTO getResumePreview(Long id);
}
