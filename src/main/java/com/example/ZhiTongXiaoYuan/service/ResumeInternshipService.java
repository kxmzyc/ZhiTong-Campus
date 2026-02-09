package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.ResumeInternship;

import java.util.List;

/**
 * 实习经历服务接口
 */
public interface ResumeInternshipService extends IService<ResumeInternship> {

    /**
     * 根据简历ID获取实习经历列表
     */
    List<ResumeInternship> getByResumeId(Long resumeId);

    /**
     * 创建实习经历
     */
    ResumeInternship createInternship(ResumeInternship internship);

    /**
     * 更新实习经历
     */
    ResumeInternship updateInternship(ResumeInternship internship);

    /**
     * 删除实习经历
     */
    boolean deleteInternship(Long id);
}
